import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import VueRouter from 'vue-router'
import Rooms from '../rooms/rooms.component'

Vue.use(VueRouter);

const Foo = { template: '<div><a href="#/Rooms/1">Go To Room 1</a></div>' }
 

const routes = [
    { path: '/foo', component: Foo },
    { path: '/Rooms/:roomID?', component: Rooms }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
export const Router = new VueRouter({
    routes // short for routes: routes
})
 
