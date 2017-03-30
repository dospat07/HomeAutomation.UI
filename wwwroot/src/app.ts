
import 'bootstrap'
import Vue from 'vue'
 
import HelloComponent from './HelloComponent'

 
new Vue({
    el: '#app',
    components: {  'hello-component':HelloComponent},
    data: {
        message: 'press the button'
    }

})



