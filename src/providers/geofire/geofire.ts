import { Injectable } from '@angular/core';
import { GoogleMap, GoogleMapsEvent, VisibleRegion, Spherical, Marker, ILatLng, LocationService, MyLocation } from '@ionic-native/google-maps';
import GeoFire, { GeoQuery, GeoCallbackRegistration } from 'geofire';
import { FirebaseDatabaseProvider } from '../firebase-database/firebase-database';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import { Event } from '../../models/event';
import { Subscription } from 'rxjs/Subscription';

declare type Location = [number, number];
export declare type GeoItem<T> = [T, Location, number];

/**
 * Provider offering methods to access Geofire
 */
@Injectable()
export class GeofireProvider {

  /**
   * The geofire initialized around devices
   */
  private devicesGeoFire: GeoFire;

  /**
   * The geofire initialized around events
   */
  private eventsGeofire: GeoFire;

  constructor(private firebaseDatabase: FirebaseDatabaseProvider) {
    this.devicesGeoFire = new GeoFire(firebaseDatabase.getDevicesLocations());
    this.eventsGeofire = new GeoFire(firebaseDatabase.getEventsLocations());
  }

  /**
   * Gets nearby events based on the given radius
   * @param defaultRadius the radius to start pulling events for immediately
   * @param radius an observable that updates the query radius
   */
  getNearbyEvents(defaultRadius: number, radius: Observable<number>): Observable<{[id: string]: Event}> {
    let generator = (observer: Observer<any>) => {
      let onKeyEnteredRegistration: GeoCallbackRegistration, onKeyExitedRegistration: GeoCallbackRegistration;

      let subscriptions: {[id: string]: Subscription} = {};

      let query: GeoQuery;
      //TODO if location is changing, use a combineLatest
      //eventually use something like flatMap() or .scan() to merge observables instead of current approach
      LocationService.getMyLocation().then((myLocation: MyLocation) => {
        query = this.eventsGeofire.query({
          center: GeofireProvider.convertToTuple(myLocation.latLng),
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
          subscriptions[key] = this.firebaseDatabase.getEvent(key).subscribe(event => observer.next([key, event]));
        });

        onKeyExitedRegistration = query.on("key_exited", (key, location, distance) => {
          subscriptions[key].unsubscribe();
          delete subscriptions[key];
          observer.next([key, null]);
        });
      });
      return () => {
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

  /**
   * Gets nearby events based on the given radius, including their distance from the user's position
   * @param defaultRadius the radius to start pulling events for immediately
   * @param radius an observable that updates the query radius
   */
  getNearbyGeoEvents(defaultRadius: number, radius: Observable<number>): Observable<{[id: string]: GeoItem<Event>}> {
    let generator = (observer: Observer<any>) => {
      let onKeyEnteredRegistration: GeoCallbackRegistration, onKeyMovedRegistration: GeoCallbackRegistration, onKeyExitedRegistration: GeoCallbackRegistration;

      let subscriptions: {[id: string]: Subscription} = {};

      let query: GeoQuery;
      //TODO if location is changing, use a combineLatest
      //eventually use something like flatMap() or .scan() to merge observables instead of current approach
      LocationService.getMyLocation().then((myLocation: MyLocation) => {
        query = this.eventsGeofire.query({
          center: GeofireProvider.convertToTuple(myLocation.latLng),
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
          subscriptions[key] = this.firebaseDatabase.getEvent(key).subscribe(event => observer.next([key, [event, location, distance]]));
        });

        onKeyMovedRegistration = query.on("key_moved", (key, location, distance) => {
          subscriptions[key].unsubscribe();
          subscriptions[key] = this.firebaseDatabase.getEvent(key).subscribe(event => observer.next([key, [event, location, distance]]));
        });

        onKeyExitedRegistration = query.on("key_exited", (key, location, distance) => {
          subscriptions[key].unsubscribe();
          delete subscriptions[key];
          observer.next([key, null]);
        });
      });
      return () => {
        if(onKeyEnteredRegistration) onKeyEnteredRegistration.cancel();

        if(onKeyMovedRegistration) onKeyMovedRegistration.cancel();

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

  /**
   * Initializes the map to pull the markers from Geofire
   * @param map the map to put the markers onto
   * @param onClickGenerator the function to run when a marker is clicked on
   * @deprecated Needs to change
   */
  initializeMap(map: GoogleMap, onClickGenerator: (key) => (any) => any){
    let query: GeoQuery;
    let markers: Map<String, Promise<Marker>> = new Map();
    //Array of icon images
    var images = ['../../resources/planeNew1.png', '../../resources/planeNew2.png'];
    map.addEventListener(GoogleMapsEvent.MAP_READY).subscribe(() => {
      query = this.devicesGeoFire.query(this.generateQuery(map));
      var onKeyEnteredRegistration = query.on("key_entered", (key, location, distance) => {
        
        //Determine which icon to choose based on odd or even uav number
        var keyLength = key.length;
        var lastChar = key.charAt(keyLength - 1);
        var theImage = !(parseInt(lastChar) % 2)? images[0] : images[1];

        let marker = map.addMarker({
          position: GeofireProvider.convertToObj(location),
          icon: theImage
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
          marker.setPosition(GeofireProvider.convertToObj(location));
          return marker;
          //use Spherical.computeHeading() with old to get icon rotation
        });
      });
    });
    map.addEventListener(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(()=>{
      query.updateCriteria(this.generateQuery(map));
    });
  }

  /**
   * Gets the location of the device as an observable updating every 2 seconds
   * @param key the key/id of the device
   */
  getDeviceLocation(key: string): Observable<ILatLng> {
    return Observable.interval(2000).switchMap(() => this.devicesGeoFire.get(key).then(GeofireProvider.convertToObj)).distinctUntilChanged(GeofireProvider.locationEquals);
  }

  /**
   * Gets the location of the event as an observable updating every 2 seconds
   * @param key the key/id of the event
   */
  getEventLocation(key: string): Observable<ILatLng> {
    return Observable.interval(2000).switchMap(() => this.eventsGeofire.get(key).then(GeofireProvider.convertToObj)).distinctUntilChanged(GeofireProvider.locationEquals);
  }

  /**
   * Converts a location between tuple and object form
   * @param {[number, number]} location location as a tuple
   */
  private static convertToObj(location: [number, number]): ILatLng {
    return {
      lng: location[1],
      lat: location[0]
    };
  }

  /**
   * Converts a location between object and tuple form
   * @param {ILatLng} location location as an object
   */
  private static convertToTuple(location: ILatLng): [number, number] {
    return [location.lat, location.lng];
  }

  /**
   * Generates the query based on the current map window
   * @param {GoogleMap} map the map to generate the query for
   */
  private generateQuery(map: GoogleMap): GeoFire.QueryCriteria {
    let visibleRegion: VisibleRegion = map.getVisibleRegion();
    let diameter = Spherical.computeDistanceBetween(visibleRegion.northeast, visibleRegion.southwest);
    let camera = map.getCameraPosition().target;
    return {
      center: GeofireProvider.convertToTuple(camera),
      radius: diameter
    };
  }

  private static locationEquals(one: ILatLng, two: ILatLng){
    return one && two && one.lat == two.lat && one.lng == two.lng;
  }
}
