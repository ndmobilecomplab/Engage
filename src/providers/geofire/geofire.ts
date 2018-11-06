import { Injectable } from '@angular/core';
import { GoogleMap, GoogleMapsEvent, VisibleRegion, Spherical, Marker, ILatLng } from '@ionic-native/google-maps';
import GeoFire, { GeoQuery } from 'geofire';
import { FirebaseDatabaseProvider } from '../firebase-database/firebase-database';

/*
  Generated class for the GeofireProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeofireProvider {
  geoFire: GeoFire;

  constructor(firebaseDatabase: FirebaseDatabaseProvider) {
    this.geoFire = new GeoFire(firebaseDatabase.getLocations());
  }

  initializeMap(map: GoogleMap){
    let query: GeoQuery;
    let markers: Map<String, Promise<any>> = new Map();
    map.addEventListener(GoogleMapsEvent.MAP_READY).subscribe(() => {
      query = this.geoFire.query(this.generateQuery(map));
      var onKeyEnteredRegistration = query.on("key_entered", (key, location, distance) => {
        let marker = map.addMarker({
          position: this.convertToObj(location)
        });
        markers[key] = marker;
        return marker;
        //add marker at position
        //add it to dict based on key
      });
      
      var onKeyExitedRegistration = query.on("key_exited", (key, location, distance) => {
        //remove marker at index
        markers[key].then((marker: Marker) => {
          marker.remove();
        });
        markers.delete(key);
        return null;
      });
      
      var onKeyMovedRegistration = query.on("key_moved", (key, location, distance) => {
        //update marker at index
        markers[key] = markers[key].then((marker: Marker) => {
          marker.setPosition(this.convertToObj(location));
          return marker;
          //use Spherical.computeHeading() with old to get icon rotation
        });
      });
    });
    map.addEventListener(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(()=>{
      query.updateCriteria(this.generateQuery(map));
    });
  }

  convertToObj(location: [number, number]): ILatLng {
    return {
      lng: location[1],
      lat: location[0]
    };
  }

  convertToArray(location: ILatLng): [number, number] {
    return [location.lat, location.lng];
  }
  
  private generateQuery(map: GoogleMap): GeoFire.QueryCriteria {
    let visibleRegion: VisibleRegion = map.getVisibleRegion();
    let diameter = Spherical.computeDistanceBetween(visibleRegion.northeast, visibleRegion.southwest);
    let camera = map.getCameraPosition().target;
    return {
      center: this.convertToArray(camera),
      radius: diameter
    };
  }
}
