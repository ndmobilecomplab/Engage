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

/**
* Generated class for the DeviceInfoPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-device-info',
  templateUrl: 'device-info.html',
})
export class DeviceInfoPage {
  private key;
  private owner_key: string;
  private device$: Observable<Device> = null;
  private owner$: Observable<Organization> = null;
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private firebaseDatabase: FirebaseDatabaseProvider) {
    this.key = navParams.get("key");
    
    this.device$ = this.firebaseDatabase.getDevice(this.key);
    this.owner$ = this.device$.map((device : Device) => device.owner).distinctUntilChanged().concatMap((key) => {
      this.owner_key = key;
      return this.firebaseDatabase.getOrganization(key);
    });
  }
  
  ionViewDidLoad() {
    
  }
  
  ionViewWillUnload(){
  }
  
}
