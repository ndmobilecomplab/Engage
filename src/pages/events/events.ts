import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventDatePage } from '../event-date/event-date';
import { GeofireProvider } from '../../providers/geofire/geofire';
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
  range: number = 5;
  private _range: Subject<number> = new Subject();
  view: String = 'month';
  events: Observable<{[id: string]: Event}>;
  mapped: Observable<{[date: string]: Event[]}>;
  sorted: Observable<Event[]>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private geofire: GeofireProvider) {
    this._range.next(this.range);
  }
  
  rangeChange(value: number){
    this.range = value;
    this._range.next(value);
  }
  
  ionViewDidLoad() {
    this.events = this.geofire.getNearbyEvents(this.range, this._range);
    this.mapped = this.events.map((events) => {
      let dates: {[date: string] : Event[]} = {};
      for(const key in events){
        let arr = dates[events[key].startDate] || [];
        arr.push(events[key]);
        dates[events[key].startDate] = arr;
      }
      return dates;
    });
    this.sorted = this.events.map((events) => {
      let arr: Event[] = [];
      for(const key in events){
        arr.push(events[key]);
      }
      return arr.sort(Event.compare);
    });
  }

  ionViewWillLeave(){
    this.events = null;
    this.mapped = null;
  }
  
  selectedDate(date: Date){
    this.navCtrl.push(EventDatePage, {
      'date': date.toDateString(),
      'range': this.range
    });
  }
  
}
