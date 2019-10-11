import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OSService {

  constructor(private http:HttpClient) { }

  get() {
    return this.http.get('http://localhost:8080/controller/listen');
  }

  get2() {
    return this.http.get('http://localhost:8080/controller/send');
  }

}
