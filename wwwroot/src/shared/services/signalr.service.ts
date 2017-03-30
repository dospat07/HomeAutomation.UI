//  import jQuery   from 'jquery';
//  
import EventBus from './event-bus'

import '..//..//..//..//node_modules/signalr/jquery.signalR.js';


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

    public start() {

        // atempt connection, and handle errors
        this.connection.start()
            .done(() => console.log('Connected, connection ID=' + this.connection.id))
            .fail(() => console.log('Could not connect'));
    }
}
