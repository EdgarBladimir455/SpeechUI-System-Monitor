import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertService } from './services/alert.service';
import { Settings } from './model/system';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  // Settings
  private settings = new Settings();
  private url = 'http://localhost:8080';
  private playRecordedAudio = false;

  constructor(private http: HttpClient,
              private alertService: AlertService) {
  } 

  setModels() {
    if (this.settings) {
      this.url = this.settings.ip;    
      this.playRecordedAudio = this.settings.playRecordedAudio;  
    }
  }    
  ngOnInit() {
    let settings: Settings = JSON.parse( localStorage.getItem('settings') );
    this.http.get(this.url+'/server/ping', { observe: 'response', responseType: 'text' })
             .subscribe(resp => {
                if (resp.status !== 200 ) {
                  console.log(false)                  
                }
             }, err => {
                this.alertService.newAlert('Error en el servidor', 'No se pudo conectar con el servidor, revise su configuración o intentelo de nuevo', false, 'error');
             });
  }  
}

