import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GeofireProvider, GeoItem } from '../../providers/geofire/geofire';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Event } from '../../models/event';

/**
* Generated class for the EventDatePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-event-date',
  templateUrl: 'event-date.html',
})
export class EventDatePage {
  date: string;
  range: number = 5;
  private _range: Subject<number> = new Subject();
  events: Observable<{[id: string]: GeoItem<Event>}>;
  filtered: Observable<GeoItem<Event>[]>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private geofire: GeofireProvider) {
    this.date = navParams.get('date');
    this.range = +navParams.get('range');
  }
  
  rangeChange(value: number){
    this._range.next(value);
  }
  
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

  ionViewWillLeave(){
    this.events = null;
  }

  getFormattedDate = () => {
    return this.date.split(' ').splice(1).join(' ');
  }
  
}
