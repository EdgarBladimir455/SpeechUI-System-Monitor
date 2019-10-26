import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { StatusComponent } from '../status/status.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    MenuComponent, 
    StatusComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    BrowserModule,
    BrowserAnimationsModule
  ]
})
export class MenuModule { }
