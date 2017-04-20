import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'


export interface Dialog {

    title: string;
    message: string;
    show: boolean;
}
@Component({
    template: require('./vue-dialog.html'),
    props: {
        dialog: Object
    }
})
export default class VueDialog extends Vue {

    dialog: Dialog;    


    public get show():boolean{
        console.log("Show",this.dialog);
        if (this.dialog.show ===true){
             $('#messageDialog').modal('show');
             this.dialog.show = false;
        }
        return this.dialog.show;
    }
    
    private exit(): void {
        console.log('exit');
        $('#messageDialog').modal('hide');
        this.dialog.show = false;
    }
    public close() {
        console.log("close");
        this.exit();
    }
    public OK() {
        console.log("OK");
        this.exit();
    }
    public yes() {
        console.log("Yes");
        this.exit();
    }

    public no() {
        console.log("No");
        this.exit();
    }

    public mounted(){
       
    }
    // public get show(): string {
    //     return this._show;
    // }
    // public set show(value: string) {
    //     if (value === 'true') {
    //         $('#messageDialog').modal({ show: true });
    //     } else {
    //         $('#messageDialog').modal({ show: false });
    //     }
    //     this._show = value;
    // }
}
