import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandListComponent } from './command-list.component';


const routes: Routes = [
  {path:'', component:CommandListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommandListRoutingModule { }
