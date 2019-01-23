import Vue from 'vue'
import Component from 'vue-class-component'


export class Notification {

    public visible = false;
    public message = "";
    public isError = false;
    public show(message: string) {
        this.message = message;
        this.visible = true;
    }

    public showError(message:string)
    {
        this.isError  =true;
           this.show(message);     
    }
    public close  =()=> {
        console.log(this);
        this.visible = false;
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
