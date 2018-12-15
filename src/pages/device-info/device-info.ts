import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseDatabaseProvider } from '../../providers/firebase-database/firebase-database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import Organization from '../../models/organization';
import Device from '../../models/device';
import { Subject } from 'rxjs/Subject';
import { TitleCasePipe } from '@angular/common';
import { GeofireProvider } from '../../providers/geofire/geofire';
import { ILatLng } from '@ionic-native/google-maps';

/**
 * Page showing more information about the selected device on the map
 */
@IonicPage()
@Component({
  selector: 'page-device-info',
  templateUrl: 'device-info.html',
})
export class DeviceInfoPage {

  /**
   * The key used to identify this device
   */
  private key;

  /**
   * The key used to identify the owning organization
   */
  private owner_key: string;

  /**
   * The observable getting the most up-to-date information about the device
   */
  private device$: Observable<Device> = null;

  /**
   * The observable getting the most up-to-date information about the organization
   */
  private owner$: Observable<Organization> = null;

  /**
   * An observable getting the most up-to-date information about where the device is located - used for the map component
   */
  location$: Observable<ILatLng>;
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private firebaseDatabase: FirebaseDatabaseProvider, private geofire: GeofireProvider) {
    this.key = navParams.get("key");
    
    //TODO should observables be inited in constructor or in view will load
    this.device$ = this.firebaseDatabase.getDevice(this.key);
    this.owner$ = this.device$.map((device : Device) => device.owner).distinctUntilChanged().concatMap((key) => {
      this.owner_key = key;
      return this.firebaseDatabase.getOrganization(key);
    });
    this.location$ = geofire.getDeviceLocation(this.key);
  }
  
}
