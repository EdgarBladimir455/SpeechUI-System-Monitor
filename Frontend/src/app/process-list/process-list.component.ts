import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteService } from '../services/route.service';
import { BashService } from '../services/bash.service';
import { Subscription } from 'rxjs';
import { Process } from '../model/system';
import { LoadingService } from '../services/loading.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html'
})
export class ProcessListComponent implements OnInit, OnDestroy {

  // Contexto de la pantalla
  context: string = 'ProcessListComponent';

  public processList: Process[];
  private processSubscription: Subscription;
  public cpuPercentUsage: number = 0;
  public memPercentUsage: number = 0;

  public filter = '';


  constructor(private routeService: RouteService,
              private loadingService: LoadingService,
              private alertService: AlertService,
              private bashService: BashService) { }

  ngOnInit() {
    this.routeService.notInHome();
        
    this.bashService.connect();  
    
    this.processSubscription = this.bashService
                                  .processObservable()
                                  .subscribe(newProcessWrapper => {
                                    console.log(newProcessWrapper);
                                    
                                    if (this.filter !== '') {
                                      this.processList = newProcessWrapper.processList.filter(process => process.command.includes(this.filter));
                                    } else {
                                      this.processList = newProcessWrapper.processList;
                                    }

                                    this.cpuPercentUsage = newProcessWrapper.cpuUsage;
                                    this.memPercentUsage = newProcessWrapper.memUsage;
                                  });      
  }

  ngOnDestroy() {
    if (this.processSubscription && !this.processSubscription.closed) {      
      this.processSubscription.unsubscribe();    
      this.bashService.cleanAll();  
    }
  }

  killProcess(id: string) {
    this.bashService.killProcess(id);
  }
  
}
