import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GeofireProvider, GeoItem } from '../../providers/geofire/geofire';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Event } from '../../models/event';

/**
* A page showing all the events on a given date
*/
@IonicPage()
@Component({
  selector: 'page-event-date',
  templateUrl: 'event-date.html',
})
export class EventDatePage {
  
  /**
   * The selected date
   */
  date: string;
  
  /**
   * The range of events to display, selected by the user
   */
  range: number = 5;

  /**
   * The range of events to display, selected by the user, as an observable
   */
  private _range: Subject<number> = new Subject();

  /**
   * An observable containing events within a given range of the user
   */
  events: Observable<{[id: string]: GeoItem<Event>}>;

  /**
   * An observable limiting the list of events to only those happening on the same day
   */
  filtered: Observable<GeoItem<Event>[]>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private geofire: GeofireProvider) {
    this.date = navParams.get('date');
    this.range = +navParams.get('range');
  }
  
  /**
   * Method called by the frontend when the range is changed
   * @param value new value of the range selector
   */
  rangeChange(value: number){
    this.range = +value;
    this._range.next(value);
  }
  
  /**
   * Before the page is shown to the user, get the observables
   */
  ionViewWillLoad() {
    this.events = this.geofire.getNearbyGeoEvents(this.range, this._range);
    this.filtered = this.events.map((events) => {
      let dates: GeoItem<Event>[] = [];
      for(const key in events){
        if(events[key][0].startDate == this.date){
          dates.push(events[key]);
        }
      }
      return dates;
    });
  }

  /**
   * When leaving, clear the observables
   */
  ionViewWillLeave(){
    this.events = null;
  }

  /**
   * Convert the date from 'Tue Nov 9 XXXX' to just 'Nov 9 XXXX'
   * @returns the new date
   */
  getFormattedDate = (): string => {
    return this.date.split(' ').splice(1).join(' ');
  }
  
}
