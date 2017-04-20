
import 'bootstrap'
import "es6-promise/auto";
import Menu from './/menu/menu.component'
import SignalRService from './shared/services/signalr.service';
import Http from './shared/services/http.service'
import  MessageDialog  from './shared/services/message-dialog'

// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function (predicate: any) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    }
  });
}




const signalrSerivice = new SignalRService("http://localhost:5001", "test");
signalrSerivice.start();
var menu = new Menu();
menu.$mount("#menu");

test()
async function test() {
  const http = new Http("http://localhost:5001/api/Roomss", {
    handle(status: number, statusText: string) {
       // console.log(status,statusText);
       let msg = new MessageDialog();
       msg.showMessage("Http",statusText);
    }
  });
  try {
    const a = await http.ajaxAsync("GET");
    console.log(a);
  }
  catch (e) {
    console.log('catch 3 ');
  }
}




