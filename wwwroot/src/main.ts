import './shared/polyfill'
import './shared/regenerator-runtime'
import 'bootstrap'
// import "es6-promise/auto";
import App from './/app/app.component'

// import Http from './shared/services/http.service'
// import  MessageDialog  from './shared/services/message-dialog'

var app = new App();
app.$mount("#app");
app.start();






