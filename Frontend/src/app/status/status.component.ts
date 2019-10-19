import { Component, OnInit, Input } from '@angular/core';
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

  pcName:string = 'Anonymous';
  capacity:number = 0;
  used:number = 0;
  available:number = 0;
  
  constructor() { }

  ngOnInit() {
  }

  changeStatView(view:number) {
    this.statView = view;
  }

}
