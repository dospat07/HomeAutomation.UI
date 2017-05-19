

import EventBus from './event-bus'

/*import '..//..//..//..//node_modules/signalr/jquery.signalR.js';
export default class SignalRService {
    connection: SignalR.Hub.Connection;
    proxy: SignalR.Hub.Proxy;
    eventBus:EventBus
    constructor(private url: string, private hub: string) {
        this.connection = $.hubConnection(this.url);
        this.proxy = this.connection.createHubProxy(this.hub);
        this.eventBus  =new EventBus();
        // receives broadcast messages from a hub function, called "onEvent"
        this.proxy.on('onEvent',(type: any, message: any)=>{
          //  console.log("SignalR received type " + type + " message :" + JSON.stringify(message));
            this.eventBus.send(type,message);
        });
    };

    public get conectionID():string{
        return  this.connection.id;
    }
    public start() {

        // atempt connection, and handle errors
        this.connection.start()
            .done(() => console.log('SignalR connected, connection ID=' + this.connection.id))
            .fail(() => console.log('SignalR could not connect'));
    }
}

*/

import * as signalR from '..//..//..//..//node_modules/signalr-client/dist/browser/signalr-client.js';
//import * as signalR from "signalr-client";
//var signalR = require ('..//..//..//..//node_modules/signalr-client/dist/browser/signalr-client.js');
//import * as signalR from "..//..//..//..//node_modules/signalr-client/dist/src/index"
export default class SignalRService {


    // connection : signalR.HubConnection; 
    connection: any;
    eventBus: EventBus
    constructor(private url: string,closedCallback:any) {

        this.connection = new signalR.HubConnection(url, 'formatType=json&format=text');


        this.eventBus = new EventBus();

         this.connection.onClosed = closedCallback;
        // receives broadcast messages from a hub function, called "onEvent"
        this.connection.on('onEvent', (type: any, message: any) => {
            // console.log("SignalR received type " + type + " message :" + JSON.stringify(message));
            this.eventBus.send(type, message);

        });
    };

    public get conectionID(): string {
        // return  this.connection.id;
        return this.url;

    }
    public start() {

        return this.connection.start(signalR.TransportType.WebSockets);


    }
}

