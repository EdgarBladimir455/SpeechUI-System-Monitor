import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';


const routes: Routes = [
  { path:'menu',
    component:MenuComponent,
    children: [
      {path:'opciones', loadChildren: './menu-options/menu-options.module#MenuOptionsModule'},
      {path:'procesos', loadChildren: './process-list/process-list.module#ProcessListModule'}
    ]
  },
  {path:'**', redirectTo:'menu/opciones'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
