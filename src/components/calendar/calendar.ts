import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/**
* Generated class for the CalendarComponent component.
*
* See https://angular.io/api/core/Component for more info on Angular
* Components.
*/
@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class CalendarComponent {

  @Input() events: {[date: string]: Event[]};
  
  @Output() select: EventEmitter<Date> = new EventEmitter();

  today: Date
  date: Date;
  daysInThisMonth: Date[];
  daysInLastMonth: Date[];
  daysInNextMonth: Date[];
  calendarDays: Date[];
  monthNames: String[] = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  currentMonth: String;
  currentYear: Number;
  currentDate: Number;
  
  constructor() {
    this.today = new Date();
    this.today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
    this.date = new Date(this.today);
    this.getDaysOfMonth();
  }

  getDaysOfMonth(): void {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();

    const makeDate = (baseDate, date) => {
      let day = new Date(baseDate);
      day.setDate(date);
      return day;
    }
  
    let firstWeekdayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    let lastMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    let prevNumOfDays = lastMonth.getDate();
    for(let i = prevNumOfDays-(firstWeekdayThisMonth-1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(makeDate(lastMonth, i + 1));
    }
  
    let thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
    for (let i = 0; i < thisNumOfDays; i++) {
      this.daysInThisMonth.push(makeDate(this.date, i + 1));
    }
  
    let lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
    let nextMonth = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    for (let i = 0; i < (6-lastDayThisMonth); i++) {
      this.daysInNextMonth.push(makeDate(nextMonth, i + 1));
    }
    let totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
    if(totalDays<36) {
      for(let i = (7-lastDayThisMonth); i < ((7-lastDayThisMonth)+7); i++) {
        this.daysInNextMonth.push(makeDate(nextMonth, i));
      }
    }
    this.calendarDays = [...this.daysInLastMonth, ...this.daysInThisMonth, ...this.daysInNextMonth];
  }
  
  goToLastMonth(): void {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

  goToNextMonth(): void {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    this.getDaysOfMonth();
  }

  trigger(day: Date): void {
    this.select.emit(day);
  }

  monthClasses(day: Date) {
    const diffMonth = day.getMonth() !== this.date.getMonth();
    return {
      'last-month': diffMonth && day < this.date,
      'next-month': diffMonth && day > this.date
    }
  }

  number(events: {[date: string]: Event[]}, date: Date): string {
    if(events && events[date.toDateString()]){
      return events[date.toDateString()].length + ' events';
    }
  }
}
