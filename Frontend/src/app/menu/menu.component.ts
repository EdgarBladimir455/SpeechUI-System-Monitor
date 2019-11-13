import { Component, OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { slideInAnimation } from './animations';
import { Store } from '@ngrx/store';
import { context } from '../ngrx/command/command.actions';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  animations: [
    slideInAnimation
  ]
})
export class MenuComponent implements OnInit {

  constructor(private store: Store<{ context: string }>) { }

  ngOnInit() {}

  activate(outletComponent) {
    this.store.dispatch( context({context: outletComponent.context}) );
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
