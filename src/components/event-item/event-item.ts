import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventInfoPage } from '../../pages/event-info/event-info';
import { Event } from '../../models/event';
import { GeoItem } from '../../providers/geofire/geofire';

/**
 * An item showing a brief bit of information about an event
 */
@Component({
  selector: 'event-item',
  templateUrl: 'event-item.html'
})
export class EventItemComponent {
  /**
   * The event, containing the distance it is from the user's location
   */
  @Input() event: GeoItem<Event>;

  constructor(private navCtrl: NavController) {
  }

  /**
   * When selected, launch the user into a more descriptive page about the event
   */
  selected(){
    this.navCtrl.push(EventInfoPage, { event: this.event[0].key });
  }

}
