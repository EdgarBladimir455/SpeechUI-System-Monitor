import { Component, OnInit, Input } from '@angular/core';
import { OSService } from 'src/app/services/os.service';
import { EventSourcePolyfill } from 'ng-event-source';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  // Opcion de la vista
  statView:number = 1;
  
  // Mensajes de la vista
  progress:number = 13.3;
  pcName:string = 'Anonymous';
  capacity:number = 0;
  used:number = 0;
  available:number = 0;

  myData;
  
  constructor(private osService:OSService) { }

  ngOnInit() {
    setTimeout(() => {
      this.websocket();      
    }, 3000);
  }

  getCurrentOSStat() {
  }

  changeStatView(view:number) {
    this.statView = view;
  }

  websocket() {
    const socket = new WebSocket("ws://localhost:8080/socket");
    socket.binaryType = "arraybuffer";

    socket.onopen = function (event) {
      console.log("Conectado al websocket");
      socket.send("Hola gggg");
      socket.send(new ArrayBuffer(0));
    };
    
    socket.onmessage = function(msg) {
      console.log(msg);      
    }

    
  }

  connect(): void {

    // this.osService.get().subscribe(data => {
    //   console.log(data);      
    // });
    
    let source = new EventSource('http://localhost:8080/emit-data-sets');
        source.addEventListener('message', message => {
            console.log(message.data); 
        });   

    // source.addEventListener('message', message => {
    //   console.log(message);                          
    // });

    source.onmessage = (message) => {
      console.log('message received');
    };

    source.onopen = (a) => {
      console.log('Connection Open');
    };

    source.onerror = (e) => {
      source.close();
      console.log(e);      
      console.log('Connection closed');
    };
    source.addEventListener('heartBeat', message => {
      console.log('keepalive message');
    });

    

    // this.osService.get2().subscribe(data => {
    //   console.log(data);      
    // });
 }

}
