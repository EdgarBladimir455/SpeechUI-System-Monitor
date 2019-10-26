import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';


const routes: Routes = [
  { path:'bash',
    component:MenuComponent,
    children: [
      {path:'menu', loadChildren: './menu-options/menu-options.module#MenuOptionsModule', data: {animation:'menu'}},
      {path:'configuracion', loadChildren: './configurations/configurations.module#ConfigurationsModule', data: {animation: 'conf'}},
      {path:'procesos', loadChildren: './process-list/process-list.module#ProcessListModule'},
      {path:'comandos', loadChildren: './command-list/command-list.module#CommandListModule'}
    ]
  },
  {path:'**', redirectTo:'bash/menu'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
