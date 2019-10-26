import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteService } from '../services/route.service';
import { LoadingService } from '../services/loading.service';
import { Subscription } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';

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
              private alertService: AlertService,
              private router: Router,
              private store: Store<{ route: string }>) { }

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

    this.store.pipe(select('routeReducer')).subscribe(route => {
      console.log("nueva ruta");      
      this.router.navigate([route]);
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

  record() {
    console.log("grabando audio");    
  }

}
