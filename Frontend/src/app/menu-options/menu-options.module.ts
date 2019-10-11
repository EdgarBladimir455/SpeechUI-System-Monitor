import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuOptionsRoutingModule } from './menu-options-routing.module';
import { MenuOptionsComponent } from './menu-options.component';


@NgModule({
  declarations: [MenuOptionsComponent],
  imports: [
    CommonModule,
    MenuOptionsRoutingModule
  ]
})
export class MenuOptionsModule { }
