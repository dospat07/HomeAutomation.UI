export enum Buttons{
    OK,
    YesNo
}

export interface Dialog {

    title: string;
    message: string;
    show: boolean;
    result: boolean;
    buttons:Buttons;
    showMessage(title:string,message:string,buttons:Buttons):void

}