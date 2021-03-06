import { Component, OnInit, OnDestroy } from '@angular/core';
import { Settings } from '../model/system';
import { AlertService } from '../services/alert.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { Store, select } from '@ngrx/store';
import { skip } from 'rxjs/operators';
import { RouteService } from '../services/route.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({
            opacity: '0',
            transformOrigin: '100% 0',
          }),
          animate('350ms cubic-bezier(0.39, 0.575, 0.565, 1)', 
            style({
              opacity: '1',
              transformOrigin: '100% 0',
            }))
        ]),        

        transition(':leave', [
          style({
            transform: 'scaleY(1)',
            opacity: '1',
            transformOrigin: '100% 0',
          }),
          animate('350ms cubic-bezier(0.39, 0.575, 0.565, 1)', 
            style({     
              transform: 'scaleY(0)',   
              height: '0px',
              opacity: '0',   
              transformOrigin: '100% 0'
            }))
        ])
      ]
    )
  ]
})
export class ConfigurationsComponent implements OnInit, OnDestroy {

  // Contexto de la pantalla
  context: string = 'ConfigurationsComponent';

  currentBody: number;
  ipModel: string;
  spConfMsgModel:boolean;
  spErrorMsgModel:boolean;
  spRespMsgModel:boolean;
  speechTypeModel;
  settings;

  storeSubscription:Subscription;
  
  constructor(private routeService: RouteService,
              private alertService: AlertService,
              private store: Store<{actionParam: string}>) { }

  ngOnInit() {
    this.routeService.notInHome();
    
    this.settings = JSON.parse( localStorage.getItem('settings') );
    this.setModels();
    
    this.storeSubscription = this.store.pipe(select('actionReducer'), skip(1))
                                       .subscribe(actionParam => {
                                          console.log("expandiendo una opcion: "+actionParam);                
                                          this.expandBody(parseInt(actionParam));
                                       });
  }

  setModels() {
    if (this.settings) {
      this.ipModel = this.settings.ip;
      this.spConfMsgModel = this.settings.spConfMsg;
      this.spErrorMsgModel = this.settings.spErrorMsg;
      this.spRespMsgModel = this.settings.spRespMsg;
      this.speechTypeModel = this.settings.speechType;
    } else {
      this.settings = new Settings();
    }
  }  

  expandBody(bodyNumber:number) {    
    this.currentBody = (bodyNumber === this.currentBody)? null : bodyNumber;
  }

  prepareObject() {        
    this.settings.ip = this.ipModel;
    this.settings.spConfMsg = this.spConfMsgModel;
    this.settings.spErrorMsg = this.spErrorMsgModel;
    this.settings.spRespMsg = this.spRespMsgModel;
    this.settings.speechType = this.speechTypeModel;
  }

  invalid() {
    return (this.ipModel===undefined || this.ipModel==='' ||
            this.speechTypeModel===undefined || this.speechTypeModel===null)
  }

  saveSettings() {
    
    this.alertService.newAlert('Guardar configuración', '¿Desea guardar su configuración?', true, 'confirmation')
                     .then(acept => {
                        this.prepareObject();
                        localStorage.setItem('settings', JSON.stringify(this.settings) );

                        this.alertService.newAlert('Exito', 'Configuración guardada con exito', false, 'information');
                     }, cancel => {

                     });         
  }

  defaultValues() {
    this.settings = new Settings();
    this.setModels();
  }

  ngOnDestroy(): void {    
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
     }
  }
}
