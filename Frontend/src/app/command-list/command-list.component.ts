import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Store, select } from '@ngrx/store';
import { skip } from 'rxjs/operators';
import { RouteService } from '../services/route.service';


@Component({
  selector: 'app-command-list',
  templateUrl: './command-list.component.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({
            opacity: '0',
            transformOrigin: '100% 0',
          }),
          animate('350ms cubic-bezier(0.39, 0.575, 0.565, 1)', 
            style({
              opacity: '1',
              transformOrigin: '100% 0',
            }))
        ]),        

        transition(':leave', [
          style({
            
            opacity: '1',
            transformOrigin: '100% 0',
          }),
          animate('350ms cubic-bezier(0.39, 0.575, 0.565, 1)', 
            style({     
              
              height: '0px',
              opacity: '0',   
              transformOrigin: '100% 0'
            }))
        ])
      ]
    )
  ]
})
export class CommandListComponent implements OnInit {

  // Contexto de la pantalla
  context: string = 'CommandListComponent';

  currentBody: number;

  constructor(private routeService: RouteService,
              private store: Store<{actionParam: string}>) { }

  ngOnInit() {
    this.routeService.notInHome();

    this.store.pipe(select('actionReducer'), skip(1))
              .subscribe(actionParam => {
                console.log("expandiendo una opcion: "+actionParam);                
                this.expandBody(parseInt(actionParam));
              });
  }

  expandBody(bodyNumber:number) {    
    this.currentBody = (bodyNumber === this.currentBody)? null : bodyNumber;
  }

}
