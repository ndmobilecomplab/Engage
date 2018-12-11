import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseDatabaseProvider } from '../../providers/firebase-database/firebase-database';
import { Event } from '../../models/event';
import { Observable } from 'rxjs/Observable';

/**
 * A page showing more detailed information about an event
 */
@IonicPage()
@Component({
  selector: 'page-event-info',
  templateUrl: 'event-info.html',
})
export class EventInfoPage {

  /**
   * The observable tracking changes to the selected observable
   */
  event$: Observable<Event>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private firebase: FirebaseDatabaseProvider) {
    this.event$ = firebase.getEvent(navParams.get('event'));
  }
  
  ionViewDidLoad() {
  }
  
}
