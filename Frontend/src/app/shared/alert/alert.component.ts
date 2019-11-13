import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {

  public title: string = 'Titulo por defecto';
  public msg: string = 'Mensaje por defecto';
  public cancelBtn: boolean = true;
  private alertOptionsSubscription: Subscription;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertOptionsSubscription = this.alertService
                                        .alertOptionsObservable()
                                        .subscribe(newAlertOptions => {
                                          if (newAlertOptions !== null) {
                                            this.title = newAlertOptions.title;
                                            this.msg = newAlertOptions.msg;
                                            this.cancelBtn = newAlertOptions.cancelBtn;                                            
                                          }
                                        });
  }

  acept() {    
    this.alertService.acept();
  }

  cancel() {    
    this.alertService.cancel();
  }

  ngOnDestroy() {
    if (this.alertOptionsSubscription && !this.alertOptionsSubscription.closed) {
      this.alertOptionsSubscription.unsubscribe();
    }
  }

}
