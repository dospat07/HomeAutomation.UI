import  {Dialog} from '../components/vue-dialog'

export default class MessageDialog implements Dialog {
        
    title:string;
    message:string;
    show:boolean = false;

    public showMessage(title:string,message:string){
        this.title  = title;
        this.message = message;
        this.show = true;
       
         
    }
}