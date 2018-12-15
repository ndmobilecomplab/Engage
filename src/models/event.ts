/**
 * Model representing an event
 */
export class Event {
    /**
     * The id / key of the event
     */
    key: string;

    /**
     * The title of the event
     */
    title: string;

    /**
     * The key of the owning organization of the event
     */
    owner: string;

    /**
     * The starting date of the event, as obtained by Date.toDateString(), e.g. 'Tue Nov 9 XXXX'
     */
    startDate: string;

    /**
     * The starting time of the event as obtained by Date.toTimeString()
     */
    startTime: string;
    
    /**
     * The ending date of the event
     */
    endDate: string;

    /**
     * The ending time of the event
     */
    endTime: string;

    /**
     * Comparison function for two events, sorting by date
     * @param one the first event
     * @param two the second event
     */
    static compare(one: Event, two: Event): number {
        let diff = new Date(one.startDate + " " + one.startTime).valueOf() - new Date(two.startDate + " " + two.startTime).valueOf();
        if(!diff)
            return new Date(one.endDate + " " + one.endTime).valueOf() - new Date(two.endDate + " " + two.endTime).valueOf();
        return diff;
    }
}