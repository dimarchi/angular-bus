import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { DataService } from '../data.service';
import { API_KEY } from '../../app/apikeys';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit, OnChanges {

  @Input() stop: any = {};
  @Output() selectedBusRoute: EventEmitter<any> = new EventEmitter<any>();
  busses: any = [];

  constructor(private resetter: DataService) { }

  routeClicked(route) {
    for (const val of this.busses) {
      val.selected = 0;
    }

    for (const head of this.busses) {
      if (head.headsign === route.headsign) {
        head.selected = 1;
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
          'Content-Type': 'application/graphql',
          'digitransit-subscription-key': API_KEY
      },
      body: query
    })
    .then(res => res.json())
    .then(data => {
      this.busses = []; // clearing array from possible previous data
      if (data.data.stop) {
        const busPatterns = data.data.stop.patterns;
        busPatterns.map(bus => {
          // tslint:disable-next-line:max-line-length
          this.busses = [...this.busses, {gtfsId: data.data.stop.gtfsId, code: bus.code, directionId: bus.directionId, shortname: bus.route.shortName, headsign: bus.headsign, longname: bus.route.longName, selected: 0}];
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

}
