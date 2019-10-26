import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommandListRoutingModule } from './command-list-routing.module';
import { CommandListComponent } from './command-list.component';


@NgModule({
  declarations: [
    CommandListComponent
  ],
  imports: [
    CommonModule,
    CommandListRoutingModule
  ]
})
export class CommandListModule { }
