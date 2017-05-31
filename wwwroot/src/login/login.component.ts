import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import OAuthHttp from '../shared/services/oauth-http.service'
import Config from '../shared/services/config'
import VueDialog from '../shared/components/vue-dialog'
import MessageDialog, { Buttons } from '../shared/services/message-dialog'
import Http from '../shared/services/http.service'
import EventBus, { EventType } from '../shared/services/event-bus'

@Component({
    name: "Login",
    template: require("./login.html"),
    components: {

        'v-dialog': VueDialog
    }

})

export default class Login extends Vue {
    user: string = "";
    password: string = "";
    dialog = new MessageDialog();
    private eventBus:EventBus = new EventBus();
    public logon() {


        let http = new Http();
        http.request(Config.Host + "/api/login", "POST", this.onLogon, this.onError, JSON.stringify({
            "UserName": this.user,
            "Password": this.password
        }));

    }

    private onError(error){
        console.log(error);
         this.dialog.showMessage("Login",error.statusText,Buttons.OK);
    }
    private onLogon(data: any) {
        if (data === true) {
          this.eventBus.send(EventType.UserLogged,this.user);
        }else{
            this.dialog.showMessage("Login","Invalid user or password !!!",Buttons.OK);
        }
        
    

    }
}