import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/**
* A component that allows a user to browse events in a calendar view
*/
@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class CalendarComponent {

  /**
   * All the events that you want to display
   */
  @Input() events: {[date: string]: Event[]};
  
  /**
   * Allows a parent component to react when a date is selected
   */
  @Output() select: EventEmitter<Date> = new EventEmitter();


  /**
   * The current day
   */
  today: Date
  
  /**
   * A date in the month selected, defaults to today, but is offset by months
  */
  date: Date;

  /**
   * All the dates in the current month
   */
  daysInThisMonth: Date[];

  /**
   * All the dates that would fit on the calendar in the previous month
   */
  daysInLastMonth: Date[];

  /**
   * All the dates in the next month that would fit in the calendar
   */
  daysInNextMonth: Date[];

  /**
   * All the dates fitting on the current calendar window, joined together
   */
  calendarDays: Date[];

  /**
   * The names of all the months
   */
  static readonly monthNames: String[] = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  
  /**
   * The name of the current month
   */
  currentMonth: String;

  /**
   * The current year
   */
  currentYear: Number;
  
  constructor() {
    this.today = new Date();
    this.today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
    this.date = new Date(this.today);
    this.getDaysOfMonth();
  }

  /**
   * Sets up all the date arrays based on the date field
   */
  getDaysOfMonth(): void {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = CalendarComponent.monthNames[this.date.getMonth()];
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
  
  /**
   * UI driven action moving the user back a month
   */
  goToLastMonth(): void {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

  /**
   * UI driven method moving the user back a month
   */
  goToNextMonth(): void {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
    this.getDaysOfMonth();
  }

  /**
   * Triggers an output event when the user selects a day in the UI
   * @param day the selected day
   */
  trigger(day: Date): void {
    this.select.emit(day);
  }

  /**
   * Utility method to generate the formatting classes for dates, in regards to the month they are in
   * @param day the date to generate classes for
   */
  monthClasses(day: Date) {
    const diffMonth = day.getMonth() !== this.date.getMonth();
    return {
      'last-month': diffMonth && day < this.date,
      'next-month': diffMonth && day > this.date
    }
  }

  /**
   * Gets the number of events on a day
   * @param events the list of all events, sorted by event date
   * @param date the date to search for
   */
  number(events: {[date: string]: Event[]}, date: Date): string {
    if(events && events[date.toDateString()]){
      return events[date.toDateString()].length + ' events';
    }
  }
}
