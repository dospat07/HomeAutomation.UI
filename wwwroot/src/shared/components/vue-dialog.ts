import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'

import {Buttons,Dialog} from '../services/dialog'
@Component({
    template: require('./vue-dialog.html'),
    props: {
        dialog: Object
    }
})
export default class VueDialog extends Vue {

    dialog: Dialog;
    btnYesNo =false;
    btnOK = true;
    
    public get show(): boolean {
       
        if (this.dialog.show === true) {
            switch(this.dialog.buttons){
                case Buttons.OK:this.btnOK=true;this.btnYesNo=false;break;
                case Buttons.YesNo:this.btnYesNo = true;this.btnOK =false;break;
                default:break;
            }
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
        this.dialog.result = false;
        this.exit();
    }
    public OK() {
        console.log("OK");
        this.dialog.result = true;
        this.exit();
    }
    public yes() {
        console.log("Yes");
        this.dialog.result = true;
        this.exit();
    }

    public no() {
        console.log("No");
        this.dialog.result = false;
        this.exit();
    }

    public mounted() {

    }
   
}
