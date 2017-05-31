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
import Http from '../shared/services/http.service'

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
        this.eventBus.on(EventType.UserLogged, this.onLogin);

    }
    public start() {

        this.$router.addRoutes([{ path: '/Login', component: Login }]);
        let http = new Http();
        http.request(Config.Host + "/api/isAuthorized", "GET", () => {
            this.proccessAuthorizedUser();
        }, (error) => {
            console.log(error);
            this.$router.push("/login");

        });

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

            { path: '/Rooms/:roomID?', component: Rooms },
            { path: '/', component: Dashboard },
            { path: '/Charts', component: Charts }
        ]
        );
        console.log(this.$router)
    }



}