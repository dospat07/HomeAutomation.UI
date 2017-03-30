
import 'bootstrap'
import Menu from './/menu/menu.component'
import SignalRService from './shared/services/signalr.service';

var signalrSerivice = new SignalRService("http://localhost:5001", "test");
signalrSerivice.start();

var menu = new Menu();
menu.$mount("#menu");



