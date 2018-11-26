import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar/calendar';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [
		CalendarComponent
	],
	imports: [
		CommonModule,
		IonicModule
	],
	exports: [
		CalendarComponent
	]
})
export class ComponentsModule {}
