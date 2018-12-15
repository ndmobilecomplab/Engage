import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventDatePage } from '../event-date/event-date';
import { GeofireProvider, GeoItem } from '../../providers/geofire/geofire';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Event } from '../../models/event';

import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/switchMap';
import { FirebaseDatabaseProvider } from '../../providers/firebase-database/firebase-database';
import { _createNgProbe } from '@angular/platform-browser/src/dom/debug/ng_probe';

/**
* Generated class for the EventsPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  
  /**
   * The range, as set by the dropdown menu
   */
  range: number = 5;

  /**
   * The range, expressed as a Subject to pass along values to the nearby events
   */
  private _range: Subject<number> = new Subject();

  /**
   * The current view of the calendar selected
   */
  view: String = 'month';
  
  /**
   * All the events within range of the user, associated with their key/id
   */
  events: Observable<{[id: string]: Event}>;

  /**
   * All the events within range of the user, mapped to the date they start on
   */
  mapped: Observable<{[date: string]: Event[]}>;

  /**
   * All the events within range and after this moment, in sorted order
   */
  sorted: Observable<GeoItem<Event>[]>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private geofire: GeofireProvider) {
    this._range.next(this.range);
  }
  
  /**
   * Method bound to the UI to update whenever a range is selected
   * @param value the new value
   */
  rangeChange(value: number){
    this.range = value;
    this._range.next(value);
  }
  
  /**
   * Before the view is about to be shown, prepare the relevant observables
   */
  ionViewWillEnter() {
    this.mapped = this.geofire.getNearbyEvents(+this.range, this._range).map((events) => {
      let dates: {[date: string] : Event[]} = {};
      for(const key in events){
        let arr = dates[events[key].startDate] || [];
        arr.push(events[key]);
        dates[events[key].startDate] = arr;
      }
      return dates;
    });
    this.sorted = this.geofire.getNearbyGeoEvents(+this.range, this._range).map((events) => {
      let arr: GeoItem<Event>[] = [];
      for(const key in events){
        let event = events[key];
        if(new Date() > new Date(event[0].startDate + " " + event[0].startTime)){
          arr.push(event);
        }
      }
      return arr.sort((one, two) => Event.compare(one[0], two[0]));
    });
  }

  /**
   * Clear the relevant observables
   */
  ionViewWillLeave(){
    this.events = null;
    this.mapped = null;
  }
  
  /**
   * Open up the list of events on the date that was selected
   * @param date the date that was selected
   */
  selectedDate(date: Date){
    this.navCtrl.push(EventDatePage, {
      'date': date.toDateString(),
      'range': this.range
    });
  }
  
}
