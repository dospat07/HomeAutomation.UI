import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

// const routes = [
   
//     { path: '/Rooms/:roomID?', component: Rooms },
//     { path: '/', component: Remote},
//     { path: '/Login', component: Login}
// ]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
export const Router = new VueRouter({
    mode: 'history',
   // routes // short for routes: routes
})
 
