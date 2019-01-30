import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import EventBus, { EventType } from '../shared/services/event-bus'
import VueNotification, { Notification } from '../shared/components/vue-notification'
import Devices from '../devices/devices.component'
import Dashboard from '../dashboard/dashboard.component'
import Login from '../login/login.component'
import Charts from '../chart/charts.components'
import SignalRService from '../shared/services/signalr.service';
import Config from "../shared/services/config"
import VueRouter from 'vue-router'
import Http from '../shared/services/http.service'
//import { Component } from 'vue-router/types/router';

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
    private eventBus: EventBus = EventBus.Instance;
    private notification: Notification = new Notification();
    private connected: boolean = false;
    private message = "Connecting..."
    constructor() {
        super();
        this.eventBus.on(EventType.CommandSend, this.showMessage);
        this.eventBus.on(EventType.UserLogged, this.onLogin);
        this.eventBus.on(EventType.Error,this.onError)
    }
    public start() {

        
        this.$router.addRoutes([{ path: '/Login', component:  (Login  as  any)}]);
        let http = new Http();
        http.request(Config.Host + "/api/isAuthorized", "GET", () => {
            this.proccessAuthorizedUser();
        }, (error) => {
            console.log(error);
            this.$router.push("/login");

        });

    }
    private onError(data:any):void{
     
        this.notification.showError( data.message);
    }
    private showMessage(data: any): void {
        let message = "Command send to " + data.appliance;
        this.notification.show(message);

    }

    private onClosed(e: any) {
        console.log(e);
        this.connected = false;

        location.reload();
    }

    public async proccessAuthorizedUser() {
        this.addRoutes();
        try {

            let t = await this.signalrSerivice.start();
            this.connected = true;

        } catch (e) {
            console.log(e);
            this.message = "Can't connect to socket"
        }
    }

    private onLogin(user: string) {

        this.proccessAuthorizedUser();
        this.$router.push("/");
    }
    private addRoutes(): void {
        this.$router.addRoutes([

            { path: '/Devices/:roomID?', component: (Devices as any)},
            { path: '/', component: (Dashboard as any) },
            { path: '/Charts/:chartType', component: Charts,props: true  }
         
        ]
        );
       
    }



}