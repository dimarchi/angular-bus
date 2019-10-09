import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {

  @Input() stop: any = {};
  busses: any = [];

  constructor() { }

  ngOnInit() {
    
  }

  ngOnChanges() {
    
    const DIGITRANSIT_URL = 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql';

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
          this.busses = [...this.busses, {'shortname': bus.route.shortName, 'headsign': bus.headsign}];
        })
      }
        
    })
    .catch(error => {
      console.log(error);
    });
  }

}
