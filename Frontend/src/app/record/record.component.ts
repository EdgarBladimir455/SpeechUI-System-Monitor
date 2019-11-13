import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioRecordingService } from '../services/audio-recording.service';
import { Store, select } from '@ngrx/store';
import { CommandResponse, Settings } from '../model/system';
import { navigate, action } from '../ngrx/command/command.actions';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  animations: [
    trigger('zoomOut', [
      state('true', style({ transform: 'scale(0.8)' })),
      state('false', style({ transform: 'scale(1)' })),
      transition('false <=> true', animate(100))
    ]),

    trigger('audioError', [
      state('true', style({ 
        transform: 'translateX(-6px) rotate(-1.2deg)',
      })),
      state('false', style({ 
        transform: 'translateX(0%)',
        transformOrigin: '50% 50%'
      })),
      transition('false <=> true', animate(400))
    ]),

    trigger('zoom', [
      state('true', style({ 
        position: 'absolute',
        transform: 'translate(-50%,-50%)',
        left: '50%',
        top: '50%',
        cursor: 'unset'
      })),
      state('false', style({ 
        position: 'fixed',
        transform: 'unset',
        right: '0',
        bottom: '0'
      })),
      transition('false <=> true', animate(180))
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
  hoverMicro = false;

  recording = false;
  microAvailable = true;

  // Settings
  private settings = new Settings();
  private url = 'http://localhost:8080';
  private playRecordedAudio = false;

  public holdableButton = false;
  
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
      this.microAvailable = false;
      setTimeout(() => {
        this.sendRecord();        
      }, 500);

    });

    this.store.pipe(select('contextReducer')).subscribe(context => {  
      this.context = context;
    });

    this.settings = JSON.parse( localStorage.getItem('settings') );
    this.setModels();
  }

  setModels() {
    if (this.settings) {
      this.url = this.settings.ip;    
      this.playRecordedAudio = this.settings.playRecordedAudio;  
    }
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

    const req = new HttpRequest('POST', this.url+'/speech/voiceCommand', data, {
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
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blob = null;
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

    if (this.playRecordedAudio) {
      this.playAudioResponse(this.blob);
    }

    const formData = new FormData();
    formData.append('record', file );
    formData.append('context', this.context);
    

    this.uploadFile(formData).pipe(skip(1)).subscribe((data) => {

      this.microAvailable = true;
      
      // Remover if, si no es necesario
      if (data instanceof HttpResponse) { // Respuesta Object
        console.log(data);
        let contentType = data.headers.get('Content-Type');
            
        if (contentType === 'application/json') {
          let decodedString = String.fromCharCode.apply(null, new Uint8Array(data.body as any));
          let commandResponse = JSON.parse(decodedString) as CommandResponse;
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
        } else if (contentType === 'application/octet-stream') {
          this.playAudioResponse(error.error)
        }     
        
      }

      this.audioError = true;
      setTimeout(() => {
        this.audioError = false;
        this.microAvailable = true;
      }, 850);
      
    });

  }

  record() {
    if (this.microAvailable) {
      document.body.classList.add('overflow-hidden');
      this.recording = true;
  
      this.startRecording();
  
      setTimeout(() => {
        this.stopRecording();
        this.recording=false;
        document.body.classList.remove('overflow-hidden');
      }, 2680);
    }

  }

}
