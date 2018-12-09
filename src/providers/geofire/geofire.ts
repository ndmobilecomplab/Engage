import { Injectable } from '@angular/core';
import { GoogleMap, GoogleMapsEvent, VisibleRegion, Spherical, Marker, ILatLng, LocationService, MyLocation } from '@ionic-native/google-maps';
import GeoFire, { GeoQuery, GeoCallbackRegistration } from 'geofire';
import { FirebaseDatabaseProvider } from '../firebase-database/firebase-database';
import { NavController } from 'ionic-angular';
import { DeviceInfoPage } from '../../pages/device-info/device-info';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
import { Event } from '../../models/event';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

declare type Location = [number, number];
declare type GeoItem<T> = [T, Location, number];
/*
Generated class for the GeofireProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class GeofireProvider {
  geoFire: GeoFire;
  eventsGeofire: GeoFire;
  
  constructor(private firebaseDatabase: FirebaseDatabaseProvider) {
    this.geoFire = new GeoFire(firebaseDatabase.getLocations());
    this.eventsGeofire = new GeoFire(firebaseDatabase.getEventsLocations());
  }
  
  getNearbyEvents(defaultRadius: number, radius: Observable<number>): Observable<{[id: string]: Event}> {    
    let generator = (observer: Observer<any>) => {
      let onKeyEnteredRegistration: GeoCallbackRegistration, onKeyExitedRegistration: GeoCallbackRegistration;
      
      let subscriptions: {[id: string]: Subscription} = {};
      
      let query: GeoQuery;
      //TODO if location is changing, use a combineLatest
      //eventually use something like flatMap() or .scan() to merge observables instead of current approach
      LocationService.getMyLocation().then((myLocation: MyLocation) => {
        query = this.eventsGeofire.query({
          center: this.convertToArray(myLocation.latLng),
          radius: defaultRadius
        });
        let last = -1; // funny way of doing distinctUntilChanged since this edition doesn't seem to have it
        radius.subscribe((radius) => {
          if(radius != last){
            last = radius;
            query.updateCriteria({radius : 1.61 * radius});
          }
        });
        onKeyEnteredRegistration = query.on("key_entered", (key, location, distance) => {
          console.log(key, 'entered');
          subscriptions[key] = this.firebaseDatabase.getEvent(key).subscribe(event => observer.next([key, event]));
        });
        
        onKeyExitedRegistration = query.on("key_exited", (key, location, distance) => {
          subscriptions[key].unsubscribe();
          delete subscriptions[key];
          observer.next([key, null]);
        });
      });
      return () => {
        console.log('cleaning');
        if(onKeyEnteredRegistration) onKeyEnteredRegistration.cancel();
        
        if(onKeyExitedRegistration) onKeyExitedRegistration.cancel();
      }
    }
    return Observable.create(generator)
    .scan((acc: {[key: string] : Event}, value: [string, Event], index: number) => {
      if(value[1])
        acc[value[0]] = value[1];
      else
        delete acc[value[0]];
      return acc;
    }, {});
  }
  
  /*
  getNearbyGeoitemEvents(radius: number): Observable<{[id: string]: GeoItem<Event>}> {
    //repr is [key, toDelete?, location, distance]
    let generator = (observer: Observer<any>) => {
      let onKeyEnteredRegistration: GeoCallbackRegistration, onKeyMovedRegistration: GeoCallbackRegistration, onKeyExitedRegistration: GeoCallbackRegistration;
      
      let subscriptions: {[id: string]: Subscription} = {};
      
      let query: GeoQuery;
      //TODO if location is changing, use a combineLatest
      //eventually use something like flatMap() or .scan() to merge observables instead of current approach
      LocationService.getMyLocation().then((myLocation: MyLocation) => {
        query = this.eventsGeofire.query({
          center: this.convertToArray(myLocation.latLng),
          radius: 0
        });
        //radius.subscribe((radius) => query.updateCriteria({radius : 1.61 * radius}));
        onKeyEnteredRegistration = query.on("key_entered", (key, location, distance) => {
          subscriptions[key] = this.firebaseDatabase.getEvent(key).subscribe();
          observer.next(observables[key]);
        });
        
        onKeyMovedRegistration = query.on("key_moved", (key, location, distance) => {
          observer.next([key, false, location, distance]);          
        });
        
        onKeyExitedRegistration = query.on("key_exited", (key, location, distance) => {
          observables[key]
          observer.next([key, true, location, distance]);
        });
      });
      return () => {
        if(onKeyEnteredRegistration) onKeyEnteredRegistration.cancel();
        
        if(onKeyMovedRegistration) onKeyMovedRegistration.cancel();
        
        if(onKeyExitedRegistration) onKeyExitedRegistration.cancel();
      }
    }
    return Observable.create(generator)
    .concatMap(obj => obj[1] ? this.firebaseDatabase.getEvent(obj[0]).map(event => [obj[0], event, ...obj.splice(2)]) : Observable.of([obj[0], null, null, null]))
    .scan((acc: {[key: string] : GeoItem<Event>}, value: [string, Event, Location, number], index: number) => {
      acc[value[0]] = [value[1], value[2], value[3]];
      return acc;
    }, {})
    .shareReplay(1); //necessary?
  }
  */
  
  initializeMap(map: GoogleMap, onClickGenerator: (key) => (any) => any){
    let query: GeoQuery;
    let markers: Map<String, Promise<Marker>> = new Map();
    map.addEventListener(GoogleMapsEvent.MAP_READY).subscribe(() => {
      query = this.geoFire.query(this.generateQuery(map));
      var onKeyEnteredRegistration = query.on("key_entered", (key, location, distance) => {
        let marker = map.addMarker({
          position: this.convertToObj(location)
        }).then((marker) => {
          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(onClickGenerator(key));
          return marker;
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
