import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {

  @Input() stop: any = {};
  @Output() selectedBusRoute: EventEmitter<any> = new EventEmitter<any>();
  busses: any = [];

  constructor(private resetter : DataService) { }

  routeClicked(route) {
    for (let i = 0; i < this.busses.length; i++) {
      this.busses[i].selected = 0;
    }
    for (let i = 0; i < this.busses.length; i++) {
      if (this.busses[i].headsign === route.headsign) {
        this.busses[i].selected = 1;
      }
    }
    this.selectedBusRoute.emit(route);
  }

  ngOnInit() {
    
  }

  ngOnChanges() {
    
    const DIGITRANSIT_URL = 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql';

    // query from https://digitransit.fi/en/developers/apis/1-routing-api/stops/
    // Query stop by ID and information about routes that go through it
    const query = `
    {
      stop(id: "${this.stop.gtfsId}") {
        gtfsId
        name
        lat
        lon
        patterns {
          code
          directionId
          headsign
          route {
            gtfsId
            shortName
            longName
            mode
          }
        }
      }
    }
    `;

    fetch(DIGITRANSIT_URL, {
      method: 'post',
      headers: {
          'Content-Type': 'application/graphql'
      },
      body: query
    })
    .then(res => res.json())
    .then(data => {
      this.busses = []; // clearing array from possible previous data
      if (data.data.stop) {
        let busPatterns = data.data.stop.patterns;
        busPatterns.map(bus => {
          this.busses = [...this.busses, {'gtfsId': data.data.stop.gtfsId, 'code': bus.code, 'directionId': bus.directionId, 'shortname': bus.route.shortName, 'headsign': bus.headsign, 'longname': bus.route.longName, 'selected': 0}];
        });
      }
        
    })
    .catch(error => {
      console.log(error);
    });
  }

}
