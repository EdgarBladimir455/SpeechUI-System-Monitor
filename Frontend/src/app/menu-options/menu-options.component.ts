import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteService } from '../services/route.service';
import { Router } from '@angular/router';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
  selector: 'app-menu-options',
  templateUrl: './menu-options.component.html',
  animations: [
    trigger('enterAnimation', [
      state('true', style({ transform: 'scale(0.88)' })),
      state('false', style({ transform: 'scale(1)' })),
      transition('false <=> true', animate(100))
    ])
  ]
})
export class MenuOptionsComponent implements OnInit, OnDestroy {
    
  option: number = 0;

  constructor(private routeService:RouteService,
              private router:Router) { 
              }

  ngOnInit() {
    this.routeService.inHome();
  }
  
  mouseEnter(option:number) {
    this.option = option;
  }

  mouseLeave() {    
    this.option = 0;
  }

  toProcessList() {    
    this.router.navigate(['/bash/procesos']);
  }

  toSettings() {
    this.router.navigate(['/bash/configuracion']);
  }

  toCommandList() {
    this.router.navigate(['/bash/comandos']);
  }

  ngOnDestroy() {
  }
  
}
