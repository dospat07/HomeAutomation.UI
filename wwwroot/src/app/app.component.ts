import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Router } from './router'
import EventBus, { EventType } from '../shared/services/event-bus'
import VueNotification, { Notification } from '../shared/components/vue-notification'
import Rooms from '../rooms/rooms.component'
import Remote from '../dashboard/remote.component'
import Login from '../login/login.component'
import SignalRService from '../shared/services/signalr.service';
import Config from "../shared/services/config"



Vue.config.devtools = true;

@Component({
    name: "Menu",
    template: require("./app.html"),
    router: Router,
    components: {

        'v-notification': VueNotification
    }

})

export default class App extends Vue {

    private signalrSerivice = new SignalRService(Config.SignalRUrl,this.onClosed);
    private eventBus: EventBus = new EventBus();
    private notification: Notification = new Notification();
    private connected: boolean = false;
    private message ="Connecting..."
    constructor() {
        super();
        this.eventBus.on(EventType.CommandSend, this.showMessage);

    }
    private showMessage(data: any): void {
        let message = "Command send to " + data.Conditioner;
        this.notification.show(message);

    }

    private onClosed(e:any){
        console.log(e);
        this.connected = false;
        this.message = "Disconnected";
        location.reload();
    }
    public async start() {

        try {
            let t = await this.signalrSerivice.start();
            Router.addRoutes([

                { path: '/Rooms/:roomID?', component: Rooms },
                { path: '/', component: Remote },
                { path: '/Login', component: Login }
            ]
            );
            this.connected = true;
        } catch (e) {
            console.log(e);
            this.message = "Can't connect to socket"
        }
    }



}