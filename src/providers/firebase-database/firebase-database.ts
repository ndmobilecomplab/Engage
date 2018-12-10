import { Injectable } from '@angular/core';
import { database } from 'firebase';
import { FirebaseConfigProvider } from '../firebase-config/firebase-config';
import firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import Organization from '../../models/organization';
import Device from '../../models/device';
import { Observable } from 'rxjs/Observable';
import { Event } from '../../models/event';
import { Observer } from 'rxjs/Observer';
import { TeardownLogic } from 'rxjs/Subscription';
import 'rxjs/add/operator/shareReplay';

/*
Generated class for the FirebaseDatabaseProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class FirebaseDatabaseProvider {
  
  getLocations(): database.Reference {
    return firebase.database().ref('/devices/locations');
  }

  getEventsLocations(): database.Reference {
    return firebase.database().ref('/events/locations');
  }
  
  private devices: { [key: string] : Observable<Device> } = {};
  
  getDevice(key: string): Observable<Device> {
    if(!this.devices[key]){
      let generator = (observer: Observer<Device>): TeardownLogic => {
        let callback = (value: database.DataSnapshot) => {
          observer.next(value.val());
        };
        firebase.database().ref('/devices/metadata/' + key).on('value', callback);
        return () => {
          firebase.database().ref('/devices/metadata/' + key).off('value', callback);
        };
      };
      let newObservable: Observable<Device> = Observable.create(generator).share();
      this.devices[key] = newObservable;
    }
    return this.devices[key];
  }
  
  private organizations: { [key: string] : Observable<Organization> } = {};
  
  getOrganization(key: string): Observable<Organization> {
    if(!this.organizations[key]){
      let generator = (observer: Observer<Organization>): TeardownLogic => {
        let callback = (value: database.DataSnapshot) => {
          observer.next(value.val());
        };
        firebase.database().ref('/organizations/' + key).on('value', callback);
        return () => {
          firebase.database().ref('/organizations/' + key).off('value', callback);
        };
      };
      let newObservable: Observable<Organization> = Observable.create(generator).share();
      this.organizations[key] = newObservable;
    }
    return this.organizations[key];
  }

  private events: { [key: string] : Observable<Event> } = {};
  
  getEvent(key: string): Observable<Event> {
    if(!this.events[key]){
      let generator = (observer: Observer<Event>): TeardownLogic => {
        let callback = (value: database.DataSnapshot) => {
          let event = value.val();
          event.key = key;
          observer.next(event);
        };
        firebase.database().ref('/events/metadata/' + key).on('value', callback);
        return () => {
          firebase.database().ref('/events/metadata/' + key).off('value', callback);
        };
      };
      let newObservable: Observable<Event> = Observable.create(generator).shareReplay(1);
      this.events[key] = newObservable;
    }
    return this.events[key];
  }
  
  constructor(private firebaseConfig: FirebaseConfigProvider) {
  }
  
}

class ObservableListener<T> {
  private _subject: Subject<T> = new Subject<T>();
  
  usages: number = 0;
  
  observable: Observable<T>;
  
  constructor(){
    this.observable = this._subject.asObservable();
  }
  
  listener = (payload : database.DataSnapshot) => {
    this._subject.next(payload.val());
  };
  
  close = () => {
    this._subject.complete();
  }
}