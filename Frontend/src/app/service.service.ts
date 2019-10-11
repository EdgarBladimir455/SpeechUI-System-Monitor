import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  test() {
    return this.http.get('http://localhost:8080/controller/test');
  }


  test2(formData: FormData)  {  
    return this.http.post('http://localhost:8080/controller/test', formData);
  }
}
