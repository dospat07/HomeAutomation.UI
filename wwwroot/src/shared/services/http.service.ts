

export interface SuccessCallback {
    (data: any): void;
}

export interface ErrorCallback {
    (result: JQueryXHR): void;
}


export default class HttpService<T>{
    
constructor(private url?: string,private beforeSend?:{(xhr:JQueryXHR):void})
{

}

   public request( url:string,method: string, successCallback?: SuccessCallback, errorCallback?: ErrorCallback, data?: any,contentType = 'application/json') {
       
     
        $.ajax({

            contentType: contentType,
            method: method,
            url: url,
            data: data,
             xhrFields: {
                "withCredentials": true
            },
            beforeSend: (xhr) => {
                if (this.beforeSend!=undefined){
                    this.beforeSend(xhr);
                }
              

            },
            success: (result) => {
                if (successCallback !== undefined && successCallback !== null) {
                    successCallback(result);
                }

            },
            error: (result) => {


                if (errorCallback !== undefined && errorCallback !== null) {

                    errorCallback(result);
                }
                else {
                    console.log(result);
                }
            }

        });
    }


    public get(success: SuccessCallback, error?: ErrorCallback, data?: any): void {
     
        this.request(this.url,'GET', success, error, data);
    }

    public post(data:any, success?: SuccessCallback, error?: ErrorCallback) {

        this.request(this.url,"POST", success, error, JSON.stringify(data));
    }

    public put(data:any, success?: SuccessCallback, error?: ErrorCallback) {

        this.request(this.url,"PUT", success, error, JSON.stringify(data));
    }

    public delete(data:any, success?: SuccessCallback, error?: ErrorCallback) {

        this.request(this.url,"DELETE", success, error, JSON.stringify(data));
    }

  
}