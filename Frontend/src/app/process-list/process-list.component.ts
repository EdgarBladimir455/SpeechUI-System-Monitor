import { Component, OnInit } from '@angular/core';
import { RouteService } from '../services/route.service';

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html'
})
export class ProcessListComponent implements OnInit {

  constructor(private routeService:RouteService) { }

  ngOnInit() {
    this.routeService.notInHome();
  }

}
