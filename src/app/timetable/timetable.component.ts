import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  @Input() stop: any = {};
  timetable: any = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.stop.gtfsId) {
      const DIGITRANSIT_URL = 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql';

      // query from https://digitransit.fi/en/developers/apis/1-routing-api/stops/
      // Query scheduled departure and arrival times of a stop
      const query = `
      {
        stop(id: "${this.stop.gtfsId}") {
          name
            stoptimesWithoutPatterns {
            scheduledArrival
            realtimeArrival
            arrivalDelay
            scheduledDeparture
            realtimeDeparture
            departureDelay
            realtime
            realtimeState
            serviceDay
            headsign
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
        this.timetable = [];
          console.log('timetable data', data);
          if (data.data.stop) {
            let time = data.data.stop.stoptimesWithoutPatterns;

            time.map(t => {
              let arrival = moment(t.realtimeArrival + (t.serviceDay * 1000)).format('LLLL'); // formatting unix timestamp
              let departure = moment(t.realtimeDeparture + (t.serviceDay * 1000)).format('LLLL');
              let timeDate = new Date(t.serviceDay * 1000).toUTCString();
              this.timetable = [...this.timetable, {'name': data.data.stop.name, 'realtimeArrival': t.realtimeArrival, 'realtimeDeparture': t.realtimeDeparture, 'serviceDay': t.serviceDay, 'arrival': arrival, 'departure': departure, 'date': timeDate, 'realtime': t.realtime}];
            });
          }
          
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

}
