import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import EventBus, { EventType } from '../shared/services/event-bus'
import VueNotification, { Notification } from '../shared/components/vue-notification'
import Rooms from '../rooms/rooms.component'
import Dashboard from '../dashboard/dashboard.component'
import Login from '../login/login.component'
import Charts from '../chart/charts.components'
import SignalRService from '../shared/services/signalr.service';
import Config from "../shared/services/config"
import VueRouter from 'vue-router'

Vue.use(VueRouter);

Vue.config.devtools = true;

@Component({
    name: "App",
    template: require("./app.html"),
    router: new VueRouter({ mode: 'history', }),
    components: {

        'v-notification': VueNotification
    }

})

export default class App extends Vue {

    private signalrSerivice = new SignalRService(Config.SignalRUrl, this.onClosed);
    private eventBus: EventBus = new EventBus();
    private notification: Notification = new Notification();
    private connected: boolean = false;
    private message = "Connecting..."
    constructor() {
        super();
        this.eventBus.on(EventType.CommandSend, this.showMessage);


    }
    public async start() {

        try {
           
            let t = await this.signalrSerivice.start();
            this.addRoutes();
            this.connected = true;
            let  cookie = document.cookie.split(".AspNetCore.Cookies=");
            console.log(cookie);
            if(cookie.length === 1){
              
                this.$router.push("/login");

            }
        } catch (e) {
            console.log(e);
            this.message = "Can't connect to socket"
        }
    }
    private showMessage(data: any): void {
        let message = "Command send to " + data.Conditioner;
        this.notification.show(message);

    }

    private onClosed(e: any) {
        console.log(e);
        this.connected = false;

        location.reload();
    }


    private addRoutes(): void {
        this.$router.addRoutes([

            { path: '/Rooms/:roomID?', component: Rooms },
            { path: '/', component: Dashboard },
            { path: '/Login', component: Login },
            { path: '/Charts', component: Charts }
        ]
        );
    }



}