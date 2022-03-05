import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  resetter: number = 0;
  repositioningUser : number = 0;
}
