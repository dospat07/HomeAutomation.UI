import  {Dialog,Buttons} from './dialog'
export {Buttons}
export default class MessageDialog implements Dialog {
        
    title:string;
    message:string;
    show:boolean = false;
    result:boolean;
    buttons:Buttons
    public showMessage(title:string,message:string,buttons:Buttons){
        this.title  = title;
        this.message = message;
        this.show = true;
        this.buttons = buttons;
    
         
    }
}