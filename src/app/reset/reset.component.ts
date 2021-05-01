import { Component, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  constructor() { }

  @Output() resetView : EventEmitter<any> = new EventEmitter<any>();

  resetViewToDefault() {
    this.resetView.emit('reset');
  }

  ngOnInit(): void {
  }

}
