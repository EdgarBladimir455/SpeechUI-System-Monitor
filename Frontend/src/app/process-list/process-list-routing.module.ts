import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcessListComponent } from './process-list.component';


const routes: Routes = [
  {path:'', component:ProcessListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessListRoutingModule { }
