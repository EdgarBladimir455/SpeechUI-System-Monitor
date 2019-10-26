import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Store, select } from '@ngrx/store';


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
            transform: 'scaleY(1)',
            opacity: '1',
            transformOrigin: '100% 0',
          }),
          animate('350ms cubic-bezier(0.39, 0.575, 0.565, 1)', 
            style({     
              transform: 'scaleY(0)',   
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

  currentBody: number;

  constructor(private store: Store<{actionParam: string}>) { }

  ngOnInit() {
    this.store.pipe(select('actionReducer'))
              .subscribe(actionParam => {
                this.expandBody(parseInt(actionParam));
              });
  }

  expandBody(bodyNumber:number) {    
    this.currentBody = (bodyNumber === this.currentBody)? null : bodyNumber;
  }

}
