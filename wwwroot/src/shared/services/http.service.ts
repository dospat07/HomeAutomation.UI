

// export interface HttpErrorHandle {
//     handle(code: number, text: string): void

// }
export interface SuccessCallback {
    (data: any): void;
}

export interface ErrorCallback {
    (result: JQueryXHR): void;
}




export default class HttpService<T>
{
    // constructor(private url: string, private errorHandle: HttpErrorHandle) {

    // }
constructor(private url?: string,private beforeSend?:{(xhr:JQueryXHR):void})
{

}

    
    // public ajaxAsync(method: string, data?: any): Promise<{}> {
    //     const promise = new Promise((resolve, reject) => {
    //         let contentType = 'application/json';
    //         $.ajax({
    //             contentType: contentType,
    //             method: method,
    //             url: this.url,
    //             data: data,
    //         }).
    //             done(result => resolve(result)).
    //             fail(error => this.errorHandle.handle(error.status, error.statusText));
    //     });
    //     promise.then(
    //         (ok) => console.log('Fulfilled ', ok),
    //         (error) => console.log('Rejected ', error)
    //     );

    //     return promise;
    // }


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


    // public getArray(items: Array<T>): void {

    //     this.ajax('GET', (data: any) => {

    //         data.forEach((element: T) => { items.push(element) })
    //     });
    // }

    public getItems(onAdd: { (item: T): void }, done: { (): void }): void {
     
       this.request(this.url,'GET', (data: any) => {

             data.forEach((element: T) => { onAdd(element) });
             done();
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