import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Router } from './router'
import EventBus, { EventType } from '../shared/services/event-bus'
import VueNotification,{Notification} from '../shared/components/vue-notification'

// const routes = [
//     { path: '/foo', component: Foo },
//     { path: '/Rooms/:roomID?', component: Rooms }
// ]

// // 3. Create the router instance and pass the `routes` option
// // You can pass in additional options here, but let's
// // keep it simple for now.
// const router = new VueRouter({
//     routes // short for routes: routes
// })

Vue.config.devtools = true;

@Component({
    name: "Menu",
    template: require("./menu.html"),
    router: Router,
    components: {

        'v-notification': VueNotification
    }

})

export default class Menu extends Vue {

    private eventBus: EventBus = new EventBus();
    notification:Notification = new Notification();
    constructor() {
        super();
        this.eventBus.on(EventType.CommandSend, this.showMessage);
    }
    private showMessage(data: any): void {
        let message = "Command send to " +data.Conditioner;
        this.notification.show(message);
        
    }




}