import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteService } from '../services/route.service';
import { BashService } from '../services/bash.service';
import { Subscription } from 'rxjs';
import { Process } from '../interfaces/system';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html'
})
export class ProcessListComponent implements OnInit, OnDestroy {

  public processList: Process[];
  private processSubscription: Subscription;
  public cpuPercentUsage: number = 0;
  public memPercentUsage: number = 0;

  constructor(private routeService: RouteService,
              private loadingService: LoadingService,
              private alertService: AlertService,
              private bashService: BashService) { }

  ngOnInit() {
    this.routeService.notInHome();
        
    this.bashService.connect();  
    
    this.processSubscription = this.bashService
                                  .processObservable()
                                  .subscribe(newProcessValues => {
                                    this.processList = newProcessValues;                                    
                                    this.cpuPercentUsage = 0;
                                    this.memPercentUsage = 0;

                                    for (let i=0; i<this.processList.length; i++) {
                                      this.cpuPercentUsage+=this.processList[i].cpuUsage;
                                      this.memPercentUsage+=this.processList[i].memUsage;
                                    }

                                  });      
  }

  ngOnDestroy() {
    if (this.processSubscription && !this.processSubscription.closed) {      
      this.processSubscription.unsubscribe();    
      this.bashService.cleanAll();  
    }
  }

  killProcess(name: string) {
    this.bashService.killProcess(name);
  }
  
}
