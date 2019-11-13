import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, ReplaySubject } from 'rxjs';
import { LoadingService } from './loading.service';

interface alertOptions {
  title: string;
  msg: string;
  cancelBtn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private option = new BehaviorSubject<boolean>(null);
  private showAlert = new BehaviorSubject<boolean>(false);
  private alertOptions = new BehaviorSubject<alertOptions>(null);

  constructor(private loadingService: LoadingService) { }

  newAlert(title: string, msg: string, cancelBtn:boolean, type?:string) {
    this.alert(true);
    this.alertOptions.next({title, msg, cancelBtn});
    
    return new Promise((resolve, reject) => {
      this.option.asObservable().subscribe( acept => {

        if (acept !== null) {

          if (acept) {
            this.alert(false);
            resolve();
          } else {
            this.alert(false);
            reject();        
          }   

        }
        
      });
    });
  }

  alert(show:boolean) {
    this.option.next(null);
    this.showAlert.next(show);
    show? document.body.classList.add('overflow-hidden') :
    document.body.classList.remove('overflow-hidden');
  }

  alertObservable() {
    return this.showAlert.asObservable();
  }  

  alertOptionsObservable() {
    return this.alertOptions.asObservable();
  }

  acept() {
    this.option.next(true);
  }

  cancel() {
    this.option.next(false);
  }

}
