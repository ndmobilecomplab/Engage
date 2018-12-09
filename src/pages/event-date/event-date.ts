import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GeofireProvider } from '../../providers/geofire/geofire';
import { Subject } from 'rxjs/Subject';

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
  events: any;
  filtered: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private geofire: GeofireProvider) {
    this.date = navParams.get('date');
    this.range = +navParams.get('range');
  }
  
  rangeChange(value: number){
    this._range.next(value);
  }
  
  ionViewWillLoad() {
    this.events = this.geofire.getNearbyEvents(this.range, this._range);
    this.events.subscribe(x => console.log(x));
    this.filtered = this.events.map((events) => {
      let dates: Event[] = [];
      for(const key in events){
        if(events[key].startDate == this.date){
          dates.push(events[key]);
        }
      }
      return dates;
    });
    this.filtered.subscribe(x => console.log(x));
  }

  ionViewWillLeave(){
    this.events = null;
  }

  getFormattedDate = () => {
    return this.date.split(' ').splice(1).join(' ');
  }
  
}
