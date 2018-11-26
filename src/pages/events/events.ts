import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventDatePage } from '../event-date/event-date';
import { NgModel, NgControl } from '@angular/forms';

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
  range: Number = 5;
  view: String = 'month';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  selectedDate(date: Date){
    console.log(this.range);
    this.navCtrl.push(EventDatePage, {
      'date': date,
      'range': this.range
    });
  }

}
