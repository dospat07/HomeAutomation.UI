

export interface HttpErrorHandle{
     handle(code:number,text:string):void  
   
}
export interface SuccessCallback {
    (data: any): void;
}

export interface ErrorCallback {
    (result: JQueryXHR): void;
}


export default class HttpService<T>
{
    constructor(private url: string,private errorHandle:HttpErrorHandle) {

    }

    public ajaxAsync(method: string, data?: any): Promise<{}> {
        const promise = new Promise((resolve, reject) => {
            let contentType = 'application/json';
            $.ajax({
                contentType: contentType,
                method: method,
                url: this.url,
                data: data,
            }).
                done(result => resolve(result)).
                fail(error => this.errorHandle.handle(error.status,error.statusText));
        });
        promise.then(
            (ok) => console.log('Fulfilled ', ok),
            (error) => console.log('Rejected ', error)
        );

        return promise;
    }
    private ajax(method: string, successCallback?: SuccessCallback, errorCallback?: ErrorCallback, data?: any) {
        let contentType = 'application/json';
        //   if (method==="GET") 
        //   contentType = '';

        $.ajax({

            contentType: contentType,
            method: method,
            url: this.url,
            data: data,

            //  beforeSend: (xhr)=>{xhr.setRequestHeader('content-type','application/json');},
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


    public getArray(items: Array<T>): void {

        this.ajax('GET', (data: any) => {

            data.forEach((element: T) => { items.push(element) })
        });
    }

    public getItems(onAdd: { (item: T): void }, done: { (): void }): void {

        this.ajax('GET', (data: any) => {

            data.forEach((element: T) => { onAdd(element) });
            done();
        });
    }
    public get(success: SuccessCallback, error?: ErrorCallback, data?: any): void {

        this.ajax('GET', success, error, data);
    }

    public add(item: T, success?: SuccessCallback, error?: ErrorCallback) {
        this.ajax("POST", success, error, JSON.stringify(item));
    }

    public update(item: T, success?: SuccessCallback, error?: ErrorCallback) {
        this.ajax("PUT", success, error, JSON.stringify(item));
    }

    public delete(item: T, success?: SuccessCallback, error?: ErrorCallback) {

        this.ajax("DELETE", success, error, JSON.stringify(item));
    }
}