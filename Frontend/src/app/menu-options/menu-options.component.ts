import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { RouteService } from '../services/route.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-options',
  templateUrl: './menu-options.component.html',
  styleUrls: []
})
export class MenuOptionsComponent implements OnInit, OnDestroy {
  
  constructor(private routeService:RouteService, private router:Router) { }

  ngOnInit() {
    this.routeService.inHome();
  }
  
  toProcessList() {    
    this.router.navigate(['/menu/procesos']);
  }

  ngOnDestroy() {
  }

}
