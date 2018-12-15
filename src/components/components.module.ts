import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar/calendar';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { EventItemComponent } from './event-item/event-item';
import { MapComponent } from './map/map';

@NgModule({
	declarations: [
		CalendarComponent,
    	EventItemComponent,
    	MapComponent
	],
	imports: [
		CommonModule,
		IonicModule
	],
	exports: [
		CalendarComponent,
    	EventItemComponent,
    	MapComponent
	]
})
export class ComponentsModule {}
