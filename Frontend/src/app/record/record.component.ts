import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingService } from '../services/audio-recording.service';
import { Store, select } from '@ngrx/store';
import { CommandResponse } from '../model/system';
import { navigate, action } from '../ngrx/command/command.actions';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  animations: [
    trigger('audioError', [
      state('true', style({ 
        color: 'tomato',
        transform: 'scale(1.5) rotateZ(360deg)'
      })),
      state('false', style({ 
        color: 'white',
        transform: 'scale(1) rotateZ(0deg)'
      })),
      transition('false <=> true', animate(400))
    ]),

    trigger('zoom', [
      state('true', style({ 
        transform: 'scale(1.5)'
      })),
      state('false', style({ 
        transform: 'scale(1)'
      })),
      transition('false <=> true', animate(100))
    ])
  ],
  providers: [AudioRecordingService]
})
export class RecordComponent implements OnInit {

  isRecording = false;
  recordedTime;
  blobUrl;
  blob;
  microphoneAllowed=false;
  context: string;
  audioError = false;
  
  constructor(private audioRecordingService: AudioRecordingService,
              private sanitizer: DomSanitizer,
              private http: HttpClient,
              private store: Store<{route: string, context: string}>) {

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {   
      this.blob = data.blob
    });

    this.store.pipe(select('contextReducer')).subscribe(context => {
      console.log("nuevo contexto: "+context);      
      this.context = context;
    });
  }

  ngOnInit() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
      this.microphoneAllowed = true;
    }).catch(error => {    
      this.microphoneAllowed = false;
    });    
  }

  uploadFile(data: FormData) {
    let httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');
    httpHeaders.append('Accept', 'multipart/form-data');

    const req = new HttpRequest('POST', 'http://localhost:8080/speech/voiceCommand', data, {
      reportProgress: false,
      responseType: 'arraybuffer',
      headers: httpHeaders
    });
 
    return this.http.request(req);    
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();     

      setTimeout(() => {
        this.sendRecord();        
      }, 500);
  
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  selectDispatch(commandResponse: CommandResponse) {
    switch (commandResponse.commandType) {
      case 'action':
        this.store.dispatch(action({action: commandResponse.command, 
                                    actionParam: commandResponse.commandParam}))
        break;

      case 'serverMessage': 
        break;

      case 'navigation':
          this.store.dispatch(navigate({route: commandResponse.commandParam}));
        break;
    }
  }

  playAudioResponse(arrayBuffer) {
    let binaryData = [];
    binaryData.push(arrayBuffer);

    let blob = new Blob(binaryData, {type: 'audio'});

    this.blobUrl = this.sanitizer
                       .bypassSecurityTrustUrl(
                          URL.createObjectURL(blob)
                        );
  }

  sendRecord() {
    let file = new File([this.blob], 'record');

    const formData = new FormData();
    formData.append('record', file );
    formData.append('context', this.context);
    
    this.uploadFile(formData).subscribe((data) => {

      // Remover if, si no es necesario
      if (data instanceof HttpResponse) { // Respuesta Object
        console.log(data);
        let contentType = data.headers.get('Content-Type');
            
        if (contentType === 'application/json') {
          let decodedString = String.fromCharCode.apply(null, new Uint8Array(data.body as any));
          let commandResponse = JSON.parse(decodedString) as CommandResponse;
          console.log(commandResponse);  
          this.selectDispatch(commandResponse);
        } else if (contentType === 'application/octet-stream') { // Respuesta audio
          this.playAudioResponse(data.body);
        }
              
      }      

    }, error => {

      // Remover if, si no es necesario
      if (error instanceof HttpErrorResponse) {

        let contentType = error.headers.get('Content-Type');

        if (contentType === 'application/json') {
          let decodedString = String.fromCharCode.apply(null, new Uint8Array(error.error as any));
          let commandResponse = JSON.parse(decodedString) as CommandResponse;
          console.log(commandResponse);  
          
          this.audioError = true;

          setTimeout(() => {
            this.audioError = false;
          }, 450);
        } else if (contentType === 'application/octet-stream') {
          this.playAudioResponse(error.error)
        }     

      }

    });
  }

}
