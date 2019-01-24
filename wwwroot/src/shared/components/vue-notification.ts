import Vue from 'vue'
import Component from 'vue-class-component'


export class Notification {

    public visible = false;
    public message = "";
    public isError = false;
    public show(message: string) {
        this.showMessage(message,false);
    }

    public showError(message:string)
    {
        this.showMessage(message,true);
    }
    public close  =()=> {
        console.log(this);
        this.visible = false;
    }

    private showMessage(message:string,error:boolean){
        this.isError =  error;
        this.message = message;
        this.visible = true;
    }
}

@Component({
    template: require("./vue-notification.html"),
    props: {
        "notification": Object
    }
})


export default class VueNotification extends Vue {

    public notification: Notification;


}
