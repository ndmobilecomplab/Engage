import { Injectable } from '@angular/core';
import { database } from 'firebase';
import { FirebaseConfigProvider } from '../firebase-config/firebase-config';
import firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import Organization from '../../models/organization';
import Device from '../../models/device';
import { Observable } from 'rxjs/Observable';

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
  
  private devices: { [key: string] : ObservableListener<Device> } = {};
  
  getDevice(key: string): Observable<Device> {
    if(!this.devices[key]){
      let newObservable: ObservableListener<Device> = new ObservableListener<Device>();
      firebase.database().ref('/devices/metadata/' + key).on('value', newObservable.listener);
      this.devices[key] = newObservable;
    }
    this.devices[key].usages ++;
    return this.devices[key].observable;
  }
  
  cancelDevice(key: string): void {//database.DataSnapshot
    if(this.devices[key] && !--this.devices[key].usages){
      firebase.database().ref('/devices/metadata/' + key).off('value', this.devices[key].listener);
      this.devices[key].close();
      this.devices[key] = null;
    }
  }
  
  private organizations: { [key: string] : ObservableListener<Organization> } = {};
  
  getOrganization(key: string): Observable<Organization> {
    if(!this.organizations[key]){
      let newObservable: ObservableListener<Organization> = new ObservableListener<Organization>();
      firebase.database().ref('/organizations/' + key).on('value', newObservable.listener);
      this.organizations[key] = newObservable;
    }
    this.organizations[key].usages ++;
    return this.organizations[key].observable;
  }
  
  cancelOrganization(key: string): void {
    if(this.organizations[key] && !--this.organizations[key].usages){
      firebase.database().ref('/organizations/' + key).off('value', this.organizations[key].listener);
      this.organizations[key].close();
      this.organizations[key] = null;
    }
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