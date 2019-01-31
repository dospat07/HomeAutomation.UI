
import HttpService, { SuccessCallback, ErrorCallback } from './http.service'
import {Dialog,Buttons} from './dialog'

export default class AuthHttp<T> extends HttpService<T>{

    constructor(url?: string,private dialog?:Dialog) {
        super(url, (xhr) => {
            let token = localStorage.getItem('accessToken');
            if (token != undefined) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            };
        });
    };

    public request(url: string, method: string, successCallback?: SuccessCallback, errorCallback?: ErrorCallback, data?: any, contentType = 'application/json') {
        super.request(url, method, successCallback, (error) => {

            if (error.status == 401) {
                console.log("unauthorized must redirect to login");
                window.location.href = "/Login";

            }
            else {
                if (errorCallback != undefined && errorCallback != null) {
                    errorCallback(error);
                }else if(this.dialog!=undefined && this.dialog!=null){
                    this.dialog.showMessage("HTTP Error",error.statusText,Buttons.OK);
                }
            }
        }, data, contentType)
    };

  

 
}