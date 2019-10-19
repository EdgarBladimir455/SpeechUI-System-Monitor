import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteService } from '../services/route.service';
import { LoadingService } from '../services/loading.service';
import { Subscription } from 'rxjs';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {

  public inHome:boolean = true;
  public loading = false;
  public showAlert = false;
  private loadingSubscription: Subscription;
  private alertSubscription: Subscription;
  private routeSubscription: Subscription;

  constructor(private routeService: RouteService, 
              private loadingService: LoadingService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.routeSubscription = this.routeService.routeListener().subscribe(inHome => {
      this.inHome = inHome;
    });

    this.loadingSubscription = this.loadingService.loadingObservable().subscribe(state => {
      this.loading = state;
    });

    this.alertSubscription = this.alertService.alertObservable().subscribe(showAlert => {      
      this.showAlert = showAlert;
    });
  }
  
  ngOnDestroy() {
    if (this.loadingSubscription && !this.loadingSubscription.closed) {
      this.loadingSubscription.unsubscribe();
    }

    if (this.routeSubscription && !this.routeSubscription.closed) {
      this.routeSubscription.unsubscribe();
    }
    
    if (this.alertSubscription && !this.alertSubscription.closed) {
      this.alertSubscription.unsubscribe();
    }
  }

}
