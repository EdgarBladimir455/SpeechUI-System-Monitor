import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuOptionsComponent } from './menu-options.component';


const routes: Routes = [
  {path: '', component:MenuOptionsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuOptionsRoutingModule { }
