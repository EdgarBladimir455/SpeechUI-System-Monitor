import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouteService } from '../services/route.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  public inHome:boolean = true;

  constructor(private routeService:RouteService) { }

  ngOnInit() {
    this.routeService.routeListener().subscribe(inHome => {
      this.inHome = inHome;
    });
  }

}
