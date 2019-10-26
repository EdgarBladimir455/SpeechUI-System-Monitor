import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationsComponent } from './configurations.component';

const routes: Routes = [
  {path:'', component: ConfigurationsComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConfigurationsRoutingModule { }
