import { Component, OnDestroy, OnInit } from '@angular/core';
import { AudioRecordingService } from './audio-recording.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceService } from './service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import {FileUploader} from "ng2-file-upload";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
    .start-button {
      background-color: #7ffe9f; /* Green */
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin-bottom: 10px;
    }

    .stop-button {
      background-color: rgba(118, 146, 254, 0.69); /* Green */
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin-bottom: 10px;

    }

    .cancel-button {
      background-color: #af7541; /* Green */
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin-bottom: 10px;

    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {

  uploadForm: FormGroup;

  public uploader:FileUploader = new FileUploader({
    isHTML5: true
  });

  title: string = 'Angular File Upload';
  // constructor(private fb: FormBuilder, private http: HttpClient ) { }

  uploadSubmit(){
        for (let i = 0; i < this.uploader.queue.length; i++) {
          let fileItem = this.uploader.queue[i]._file;
          if(fileItem.size > 10000000){
            alert("Each File should be less than 10 MB of size.");
            return;
          }
        }
        for (let j = 0; j < this.uploader.queue.length; j++) {
          let data = new FormData();
          let fileItem = this.uploader.queue[j]._file;

          console.log(fileItem.name);
          data.append('file', fileItem);
          console.log(data);
          
          this.uploadFile(data).subscribe((data:any) => console.log(data.message));
        }
        this.uploader.clearQueue();
  }

  uploadFile(data: FormData) {
    let httpHeaders = new HttpHeaders();
    httpHeaders.append('Content-Type', 'multipart/form-data');
    httpHeaders.append('Accept', 'multipart/form-data');

    const req = new HttpRequest('POST', 'http://localhost:8080/controller/test', data, {
      reportProgress: true,
      responseType: 'text',
      headers: httpHeaders
    });
 
    return this.http.request(req);
    
  }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      document: [null, null],
      type:  [null, Validators.compose([Validators.required])]
    });
  }

  test() {
    this.http.get('http://localhost:8080/controller/get').subscribe(data => {
      console.log(data);
      
    });
  }
  
  isRecording = false;
  recordedTime;
  blobUrl;
  blob;

  constructor(private formBuilder: FormBuilder, private audioRecordingService: AudioRecordingService, private sanitizer: DomSanitizer, private http: HttpClient) {

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      console.log("getBlob: "+data);
      console.log(data);      
      this.blob = data.blob

      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
    });
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
      console.log(this.blobUrl);    
      
      setTimeout(() => {
        this.test2();        
      }, 2000);
      
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  // test() {
  //   this.http.test().subscribe(data => {
  //     console.log(data);      
  //   });
  // }


  blobToFile = (theBlob: Blob, fileName:string): File => {
    let b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }

  test2() {
 
    // console.log(fileItem.name);
    // data.append('file', fileItem);
    // console.log(data);


    let file = new File([this.blob], 'file.mp3');

    const formData = new FormData();
    formData.append('file', file );

    console.log(formData);
    
    this.uploadFile(formData).subscribe(data => {
      console.log(data);        
    })
  }
}

