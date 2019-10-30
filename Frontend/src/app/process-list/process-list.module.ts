import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessListRoutingModule } from './process-list-routing.module';
import { ProcessListComponent } from './process-list.component';
import { StatusComponent } from '../status/status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ProcessListComponent, StatusComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProcessListRoutingModule,
  ]
})
export class ProcessListModule { }
