
export class Event {
    key: string;
    title: string;
    owner: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;

    static compare(one: Event, two: Event): number {
        let diff = new Date(one.startDate + " " + one.startTime).valueOf() - new Date(two.startDate + " " + two.startTime).valueOf();
        if(!diff)
            return new Date(one.endDate + " " + one.endTime).valueOf() - new Date(two.endDate + " " + two.endTime).valueOf();
        return diff;
    }
}