import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuOption } from '../interfaces/Menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public menuOptions:MenuOption[] = [
    {
      title: 'Mantenimiento',
      label: 'Automatico',
      description: '',
      note: 'Ultimo analisis: Hoy'
    },
    {
      title: 'Configuración',
      label: '',
      description: 'Configuración general del sistema',
      note: ''
    },
    {
      title: 'Liberar espacio',
      label: '',
      description: '388 MB de espacio disponible para liberar',
      note: ''
    },
    {
      title: 'Optimizar',
      label: '',
      description: '6 Optimizaciones encontradas',
      note: ''
    } 
  ];

  constructor() { }

  ngOnInit() {

    // setInterval(() => {
    //   this.progress = this.progress+1;
    // }, 1000)
  }

  outlet() {         
    setTimeout(() => {
      document.body.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
      });
    }, 100);


  }

}
