import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import OAuthHttp from '../shared/services/oauth-http.service'
import Config from '../shared/services/config'
import VueDialog from  '../shared/components/vue-dialog'
import MessageDialog ,{Buttons}from  '../shared/services/message-dialog'
 
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
        let http = new OAuthHttp(null,this.dialog);

        http.request(
            Config.TokenUrl,
            "POST",
            this.onLogon,
            (error) => {
            this.dialog.showMessage("Logon","Invalid user or password",Buttons.OK);
            },
            //"grant_type=password&username=" + user + "&password=" + password
            "grant_type=client_credentials&scope=engine&client_id=" + this.user + "&client_secret=" + this.password
            ,
            "application/x-www-form-urlencoded"
        )


    }

    private onLogon(data: any) {

        console.log(data);
        localStorage.setItem('accessToken', data.access_token);
        this.$router.push('/');

    }
}