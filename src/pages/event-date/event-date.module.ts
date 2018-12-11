import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventDatePage } from './event-date';

/**
 * @ignore
 */
@NgModule({
  declarations: [
    EventDatePage,
  ],
  imports: [
    IonicPageModule.forChild(EventDatePage),
  ],
})
export class EventDatePageModule {}
