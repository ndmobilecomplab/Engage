import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar/calendar';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { EventItemComponent } from './event-item/event-item';

@NgModule({
	declarations: [
		CalendarComponent,
    	EventItemComponent
	],
	imports: [
		CommonModule,
		IonicModule
	],
	exports: [
		CalendarComponent,
    	EventItemComponent
	]
})
export class ComponentsModule {}
