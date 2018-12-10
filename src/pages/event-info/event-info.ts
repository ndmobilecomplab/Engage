import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseDatabaseProvider } from '../../providers/firebase-database/firebase-database';
import { Event } from '../../models/event';
import { Observable } from 'rxjs/Observable';

/**
* Generated class for the EventInfoPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-event-info',
  templateUrl: 'event-info.html',
})
export class EventInfoPage {
  event$: Observable<Event>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private firebase: FirebaseDatabaseProvider) {
    this.event$ = firebase.getEvent(navParams.get('event'));
  }
  
  ionViewDidLoad() {
  }
  
}
