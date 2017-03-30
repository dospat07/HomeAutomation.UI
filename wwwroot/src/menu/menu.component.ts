import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Router } from './router'
import EventBus,{EventType} from '../shared/services/event-bus'


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

    template: require("./menu.html"),
    router: Router

})

export default class Manu extends Vue {

    constructor() {
        super();
        console.clear();
        console.log("menu");
    }
    private eventBus:EventBus = new EventBus();
    public submit (){
        
        this.eventBus.send(EventType.Search,this.search); 
    }
    public brand:string = "Dashboard";
    public search:string ="";
}