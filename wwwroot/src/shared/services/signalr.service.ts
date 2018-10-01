

import EventBus from './event-bus'

 
import * as signalR from "@aspnet/signalr";
 export default class SignalRService {


    
    connection: signalR.HubConnection;
    eventBus: EventBus
    constructor(private url: string,closedCallback:any) {


        this.connection = new signalR.HubConnectionBuilder()
        .withUrl(url)
        .build();

        this.eventBus = new EventBus();

         this.connection.onclose = closedCallback;
        // receives broadcast messages from a hub function, called "onEvent"
        this.connection.on('onEvent', (msg :any) => {
            console.log("SignalR received type " + JSON.stringify(msg));
            this.eventBus.send(msg.type,msg.message);

        });
    };

    public get conectionID(): string {
      
        return this.url;

    }
    public start() {

        return this.connection.start();


    }
}

