import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../data.service';

@Component({
  selector: 'app-bus-stop',
  templateUrl: './bus-stop.component.html',
  styleUrls: ['./bus-stop.component.css']
})
export class BusStopComponent implements OnInit {

  constructor(private resetter : DataService) { }

  @Input() busStops: any = {};
  @Input() mapInstance: any = {};
  @Output() selectEvent: EventEmitter<any> = new EventEmitter<any>();

  marker = [];
  stops = L.layerGroup();

  // https://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words/54677081#54677081
    // answer by Matt Frear (September 16 2014, 11:02), modified
  degToCardinal = (num) => {
    if (Number.isNaN(num)) {
        return;
    }

    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
  }

  getSelectedStop(stop) {
    this.selectEvent.emit(stop);

    for (let i = 0; i < this.busStops.length; i++) {
      this.busStops[i].selected = 0;
    }

    for (let i = 0; i < this.busStops.length; i++) {
      if (this.busStops[i].gtfsId === stop.gtfsId) {
        this.busStops[i].selected = 1;
      }
    }
  }

  // https://stackoverflow.com/questions/9912145/leaflet-how-to-find-existing-markers-and-delete-markers
  // modified
  removeMarks(markerStore) {
    const map = this.mapInstance;
    for (let i = 0; i < markerStore.length; i++) {
     map.removeLayer(markerStore[i]);
    }
  }

  ngOnInit() {
    
  }

  ngOnChanges() {
    this.busStops;

    this.marker = [];
    
    const map = this.mapInstance;
    map.removeLayer(this.stops);

    for (let i = 0; i < this.busStops.length; i++) {

      // from https://github.com/pointhi/leaflet-color-markers
      let greenIcon = new L.Icon({
        iconUrl: 'assets/img/marker-icon-2x-green.png',
        shadowUrl: 'assets/img/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      let mark = L.marker([this.busStops[i].lat, this.busStops[i].lon], {icon: greenIcon}).bindPopup(`${this.busStops[i].name}, ${this.busStops[i].distance} m`);
      this.marker.push(mark);
    }

    this.stops = L.layerGroup(this.marker);
    map.addLayer(this.stops);

    if (this.resetter.resetter === 1) {
      this.busStops = [];
      map.removeLayer(this.stops);
      this.resetter.resetter = 0;
    }
  }

}
