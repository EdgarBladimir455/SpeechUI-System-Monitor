import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loading = new BehaviorSubject<boolean>(false);

  constructor() {}

  loadingObservable() {
    return this.loading.asObservable();
  }

  setLoading(state:boolean) {
    this.loading.next(state);
    state? document.scrollingElement.classList.add('overflow-hidden') :
    document.scrollingElement.classList.remove('overflow-hidden');
  }
}
