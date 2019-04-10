import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseDatabaseProvider } from '../../providers/firebase-database/firebase-database';
import { Event } from '../../models/event';
import { Observable } from 'rxjs/Observable';
import { GeofireProvider } from '../../providers/geofire/geofire';
import { ILatLng } from '@ionic-native/google-maps';
import Organization from '../../models/organization';

/**
 * A page showing more detailed information about an event
 */
@IonicPage()
@Component({
  selector: 'page-event-info',
  templateUrl: 'event-info.html',
})
export class EventInfoPage {

  key: string;
  /**
   * The observable tracking changes to the selected observable
   */
  event$: Observable<Event>;

  /**
   * An observable getting the most up-to-date information about the event's owner
   */
  owner$: Observable<Organization>;

  /**
   * An observable getting the most up-to-date information about where the event is located - used for the map component
   */
  location$: Observable<ILatLng>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private firebase: FirebaseDatabaseProvider, private geofire: GeofireProvider) {
    this.key = navParams.get('event'); //Getting data passed from previous page
    console.log(this.key);
    this.event$ = firebase.getEvent(this.key);
    this.owner$ = this.event$.map((event : Event) => event.owner).distinctUntilChanged().concatMap((key) => this.firebase.getOrganization(key));
    this.location$ = geofire.getEventLocation(this.key);
  }

  ionViewDidLoad() {
  }

}
