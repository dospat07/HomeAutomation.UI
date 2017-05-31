
import {stringEnum} from './utils'
 

export interface Callback {
    (data: any): void;
}

export interface Dictionary {
    [key: string]: Array<Callback>;
}

 export const EventType = stringEnum([
    'RoomCreated',
    'RoomDeleted',
    'RoomUpdated',
    'TemperatureUpdated',
    'Error',
    'Search',
    'ScheduleCreated',
    'ScheduleDeleted',
    'CommandSend',
    "UserLogged"

])
 
 export type EventType = keyof typeof EventType;

 
export default class EventBus {

    private static callbacks: Dictionary = {};

    public constructor() {
        // console.log("EventBus ")
    }

    public on(event: EventType, callback: Callback): void {
        let topic = EventBus.callbacks[event]
        if (topic === undefined) {
            EventBus.callbacks[event] = [];
        }
        EventBus.callbacks[event].push(callback);

    }

    public off(event: EventType, callback: Callback): void {
        let topic = EventBus.callbacks[event]
        if (topic !== undefined) {
            topic.splice(topic.indexOf(callback, 1));
        }
    }

    public send(event: EventType, data: any) {

        let topic = EventBus.callbacks[event]
        if (topic !== undefined) {

            topic.forEach(element => {
                element(data);

            });
        }
    }
}