import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import OAuthHttp from '../shared/services/oauth-http.service'
import Config from '../shared/services/config'
import VueDialog from '../shared/components/vue-dialog'
import MessageDialog, { Buttons } from '../shared/services/message-dialog'
import Http from '../shared/services/http.service'

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

    public logon() {
    

      let http = new Http();
      http.request(Config.Host + "/api/login","POST",this.onLogon,null,JSON.stringify({
                "UserName": this.user,
                "Password": this.password
            }));    

    }

    private onLogon(data: any) {

     
        this.$router.push("/");

    }
}