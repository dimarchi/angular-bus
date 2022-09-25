import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DateTime } from 'luxon';
import { DataService } from '../data.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  @Input() stop: any = {};
  @Input() routeTimeTable: any = {};
  timetable: any = [];
  selectedStop: any = {};

  constructor(private resetter: DataService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.stop.gtfsId) {
      this.selectedStop = this.stop.gtfsId;
      this.updateTimeTable(this.stop.gtfsId)
    }
  }

  updateTimeTable(stopID) {
    const DIGITRANSIT_URL = 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql';

    // query from https://digitransit.fi/en/developers/apis/1-routing-api/stops/
    // Query scheduled departure and arrival times of a stop
    const query = `
      {
        stop(id: "${stopID}") {
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
        if (data.data.stop) {
          let time = data.data.stop.stoptimesWithoutPatterns;

          time.map(t => {

            const dt = DateTime.fromSeconds(t.serviceDay);
            let arrival = dt.plus({ seconds: t.realtimeArrival }).toLocaleString(DateTime.TIME_24_SIMPLE);
            let departure = dt.plus({ seconds: t.realtimeDeparture }).toLocaleString(DateTime.TIME_24_SIMPLE);
            let scheduleArr = dt.plus({ seconds: t.scheduledArrival }).toLocaleString(DateTime.TIME_24_SIMPLE);
            let scheduleDep = dt.plus({ seconds: t.scheduledDeparture }).toLocaleString(DateTime.TIME_24_SIMPLE);
            let timeDate = new Date(t.serviceDay * 1000).toUTCString();

            this.timetable = [...this.timetable, { 'name': data.data.stop.name, 'headsign': t.headsign, 'realtimeArrival': t.realtimeArrival, 'realtimeDeparture': t.realtimeDeparture, 'scheduledArrival': scheduleArr, 'scheduledDeparture': scheduleDep, 'serviceDay': t.serviceDay, 'arrival': arrival, 'departure': departure, 'date': timeDate, 'realtime': t.realtime }];
          });
        }

      })
      .catch(error => {
        console.log(error);
      });
  }

}
