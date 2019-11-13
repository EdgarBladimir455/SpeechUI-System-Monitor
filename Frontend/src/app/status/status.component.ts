import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, OnDestroy {

  // Opcion de la vista
  statView:number = 1;
  
  // Mensajes de la vista
  @Input('cpuPercentUsage') cpuPercentUsage: number = 0;
  @Input('memPercentUsage') memPercentUsage: number = 0;

  pcName:string = 'Equipo';
  capacity:number = 0;
  used:number = 0;
  available:number = 0;
  
  storeSubscription:Subscription;

  constructor(private store: Store<{actionParam: string}>) { }

  ngOnInit() {
    this.storeSubscription = this.store.pipe(select('actionReducer'), skip(1))
                                 .subscribe(actionParam => {
                                    console.log("cambiando vista: "+actionParam);                
                                    this.changeStatView(parseInt(actionParam));
                             });
  }

  changeStatView(view:number) {
    if (view > 0) {
      this.statView = view;
    }
  }

  ngOnDestroy(): void {
   if (this.storeSubscription) {
    this.storeSubscription.unsubscribe();
   }
  }

}
