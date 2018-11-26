import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  date: Date;
  range: Number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.date = navParams.get('date');
    this.range = navParams.get('range');
    console.log(this.range);
  }

  ionViewDidLoad() {
  }

  getFormattedDate = () => {
    return this.date.toDateString().split(' ').splice(1).join(' ');
  }

}
