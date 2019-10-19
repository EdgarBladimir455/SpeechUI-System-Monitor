import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Process } from '../interfaces/system';
import { AlertService } from './alert.service';
import { LoadingService } from './loading.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BashService {

  private url = 'http://localhost:8080/monitor';
  private processBehaviorSubject = new ReplaySubject<Process[]>(1);
  private source: EventSource;
  private timeout;

  // Mensajes
  private readonly defaultErrorMsg = 'No se pudo establecer conexión con el servidor, o se perdio la conexión con el mismo';

  constructor(private alertService: AlertService,
              private loadingService: LoadingService,
              private http: HttpClient) { }


  /**
   * Conecta con el SSE del backend, que es el que
   * enviara la lista de procesos cada 3 seg.
   */
  connect() {    
    this.loadingService.setLoading(true);

    this.source = new EventSource(this.url+'/getProcessList');      
    
    this.source.addEventListener('message', message => {
      this.processBehaviorSubject.next( JSON.parse(message.data) );
    });   

    this.source.addEventListener('open', ev => {
      this.loadingService.setLoading(false);
      console.log('nueva conexion');      
    });

    this.source.addEventListener('error', error => {
      this.loadingService.setLoading(false);
      console.log('Connection closed');   
      this.errorHandler(error);      
    });

    this.source.addEventListener('heartBeat', message => {
      // console.log('keepalive message');
    });

  }

  /**
   * Implementar despues, para que realice la reconexion
   * debido al timeout del servidor
   */
  processHeartBeat() {
    this.timeout = setInterval(() => {
                      if (this.source.readyState !== 2) {
                        this.connect();
                        console.log('nueva sesion');
                        
                      } else {
                        clearInterval(this.timeout);
                        console.log('todas las sesiones cerradas');
                      }
                    }, 10000);
  }

  processObservable() {
    return this.processBehaviorSubject.asObservable();
  }

  cleanAll() {
    if (this.source) {
      this.source.close();
      console.log("Cerrando SSE: "+this.source.readyState);      
    }
  }

  errorHandler(error, isSSE=false) {
    let errorMsg;

    if (isSSE) {
      if (error.target.readyState === 2) {
        errorMsg = 'Error en el SSE';
      }    
    } else {
      errorMsg = error;
    }

    console.log(errorMsg);
    
    // this.alertService.error('¡Error!', this.defaultErrorMsg, false)
    //                      .then( resolve => {                            
    //                             }, reject => {
    //                       });
  }

  killProcess(name: string) {

    this.alertService.newAlert('Confirmación', 'Realmente quiere terminar el proceso', true)
                     .then(resolve => {
                       this.loadingService.setLoading(true);
                       this.http.get(this.url+'/killprocess?name='+name, { responseType:'text' as 'json' })
                                .subscribe(response => {
                                 console.log(response);
                                 
                                }, error => {
                                  this.errorHandler(error);
                                }, () => {
                                  this.loadingService.setLoading(false);
                                });
                     }, reject => {
                     });

  }

}
