import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventInfoPage } from '../../pages/event-info/event-info';
import { Event } from '../../models/event';
import { GeoItem } from '../../providers/geofire/geofire';

/**
 * Generated class for the EventItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'event-item',
  templateUrl: 'event-item.html'
})
export class EventItemComponent {

  @Input() event: GeoItem<Event>;

  constructor(private navCtrl: NavController) {
  }

  selected(){
    this.navCtrl.push(EventInfoPage, { event: this.event[0].key });
  }

}
