import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimation', [

    // transition (padre(componente a eliminar) => hijo(componente nuevo))

    transition('* => menu', [
      style({ position: 'relative' }),

      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),

      query(':enter', [
        style({ left: '-100%'})
      ]),

      query(':leave', animateChild(), { optional: true }),

      group([
        query(':leave', [
          animate('0.3s ease-out', style({ left: '100%'})),
        ], { optional: true }),
        query(':enter', [
          animate('0.3s ease-out', style({ left: '-2%'})) // que tanto avanza a la derecha el child al final de la animacion (menu)
        ])
      ]),
      
      query(':enter', animateChild()),
    ]),


    transition('menu => *', [
        style({ position: 'relative' }),
  
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
  
        query(':enter', [
          style({ left: '100%'}) // que tan a la derecha esta el child al empezar la animacion (conf)
        ]),
  
        query(':leave', animateChild(), { optional: true }),
  
        group([
          query(':leave', [
            animate('0.3s ease-out', style({ left: '-100%'}))
          ], { optional: true }),
          query(':enter', [
            animate('0.3s ease-out', style({ left: '2%'}))
          ])
        ]),
        
        query(':enter', animateChild()),
      ]),
  
  ]);