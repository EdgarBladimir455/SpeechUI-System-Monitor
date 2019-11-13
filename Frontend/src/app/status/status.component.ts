import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  // Opcion de la vista
  statView:number = 1;
  
  // Mensajes de la vista
  @Input('cpuPercentUsage') cpuPercentUsage: number = 0;
  @Input('memPercentUsage') memPercentUsage: number = 0;

  pcName:string = 'Equipo';
  capacity:number = 0;
  used:number = 0;
  available:number = 0;
  
  constructor(private store: Store<{actionParam: string}>) { }

  ngOnInit() {
    this.store.pipe(select('actionReducer'))
              .subscribe(actionParam => {
                this.changeStatView(parseInt(actionParam));
              });
  }

  changeStatView(view:number) {
    if (view > 0) {
      this.statView = view;
    }
  }

}
