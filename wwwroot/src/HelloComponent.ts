import Vue from 'vue'
import Component from 'vue-class-component'

 
 
//declare function require(params:string): any;
 
  
// The @Component decorator indicates the class is a Vue component
@Component({
  // All component options are allowed in here
//   template :'<button @click="onClick">Sey Hello!</button>'

template: require("./HelloComponent.html")

})
export default class HelloComponent extends Vue {
  // Initial data can be declared as instance properties
  message: string = 'Hello '
  // Component methods can be declared as instance methods
  onClick (): void {
    window.alert(this.message +" "+ $.now());
    
    
  }
}