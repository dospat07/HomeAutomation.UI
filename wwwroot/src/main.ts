import './shared/polyfill'
import './shared/regenerator-runtime'
import 'bootstrap'
// import "es6-promise/auto";
import Menu from './/menu/menu.component'
import SignalRService from './shared/services/signalr.service';
import Http from './shared/services/http.service'
import  MessageDialog  from './shared/services/message-dialog'
import Config from "./shared/services/config"

//localStorage.setItem("accessToken","");
const signalrSerivice = new SignalRService(Config.SignalRUrl);
signalrSerivice.start(); 
var menu = new Menu();
menu.$mount("#menu");






