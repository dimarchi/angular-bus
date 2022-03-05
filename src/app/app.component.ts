import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private resetter : DataService) { }

  title = 'angular-bus';

  // https://tools.wmflabs.org/geohack/geohack.php?language=fi&pagename=Manner-Suomen_keskipiste&params=64.96_N_27.59_E_region:FI-09_type:landmark
  // as default values
  latitude: number = 64.96;
  longitude: number = 27.59;
  stops = [];
  map;
  maps;
  marker;
  selected = {};
  route = {};
  resetCheck : number = 0;
  repositioning : number = 0;

  // from https://stackoverflow.com/questions/11415106/issue-with-calculating-compass-bearing-between-two-gps-coordinates
  // modified
  bearing(lat1: number,lng1: number,lat2: number,lng2: number) {
    var dLon = (lng2-lng1);
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var brng = this.toDeg(Math.atan2(y, x));
    return 360 - ((brng + 360) % 360);
    }

   toDeg(rad: number) {
    return rad * 180 / Math.PI;
    }

    getNearestBusStops(lat: number, lon: number) {
        
        const DIGITRANSIT_URL = 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql';

        // query from https://digitransit.fi/en/developers/apis/1-routing-api/0-graphql/
        // modified
        const query = `
        {
            nearest(lat: ${lat}, lon: ${lon}, maxResults: 3, maxDistance: 100000, filterByPlaceTypes: [STOP]) {
                edges {
                    node {
                        place {
                            lat
                            lon
                            ...on Stop {
                                name
                                gtfsId
                                code
                            }
                        }
                        distance
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
            const places = data.data.nearest.edges;

            places.map(entry => {
                const location = entry.node.place;
                const distance = entry.node.distance;

                const compass = this.bearing(lat, lon, location.lat, location.lon);

                this.stops = [...this.stops, {'name': location.name, 'code': location.code, 'gtfsId': location.gtfsId, 'lat': location.lat, 'lon': location.lon, 'distance': distance, 'bearing': compass, 'selected': 0}];
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    displayLocation(position) {
        let lat = position.coords.latitude.toFixed(3);
        let lon = position.coords.longitude.toFixed(3);

        // testing coordinates, Oulu - Finland
        //lat = 65.016667;
        //lon = 25.466667;

        this.resetter.repositioningUser = 1;
        this.repositioning = this.resetter.repositioningUser;

        this.getNearestBusStops(lat, lon);
        this.marker.setLatLng([lat, lon]);
        this.map.panTo([lat, lon]);
        this.onMapReady(this.map);
    }

    onMapReady(map: L.Map) {
        setTimeout(() => {
          map.invalidateSize();
        }, 0);
    }

    selectedStop($event) {
        this.repositioning = 0;
        this.resetCheck = 0;
        this.selected = $event;
    }

    selectedRoute($event) {
        this.repositioning = 0;
        this.resetCheck = 0;
        this.route = $event;
    }

    // https://gis.stackexchange.com/questions/210041/using-leaflet-js-is-it-possible-to-know-the-onclick-location-of-a-marker-ignor/210102
    // modified
    clickedLocation($event) {
        let latlng = this.map.mouseEventToLatLng($event);
        let pos = 
        {
            coords: {
                latitude: latlng.lat,
                longitude: latlng.lng
            }
        }
        this.stops = [];
        this.displayLocation(pos);
    }

    defaultView($event?) {
        
        if ($event && $event == 'reset') {
            this.map.remove();
            this.resetCheck = 1;
        }

        this.map = L.map('map').setView([this.latitude, this.longitude], 13);
        this.maps = this.map;
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // adding a scale indicator to map (lower left corner)
        let scale = L.control.scale().addTo(this.map);
        scale.options.metric;

        // from https://github.com/pointhi/leaflet-color-markers
        let blueIcon = new L.Icon({
            iconUrl: 'assets/img/marker-icon-2x-blue.png',
            shadowUrl: 'assets/img/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        this.marker = L.marker([this.latitude, this.longitude], {icon: blueIcon}).addTo(this.map);
        this.marker.bindPopup("Your current location").openPopup();
    }
 
    ngOnInit() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.displayLocation(position);
            },
            (denied) => {
                console.log('Not authorized by user.', denied);
            });
            
        } else {
            this.getNearestBusStops(this.latitude, this.longitude);
        }

        this.defaultView();
    }
}
