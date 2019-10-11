import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessListRoutingModule } from './process-list-routing.module';
import { ProcessListComponent } from './process-list.component';


@NgModule({
  declarations: [ProcessListComponent],
  imports: [
    CommonModule,
    ProcessListRoutingModule
  ]
})
export class ProcessListModule { }
