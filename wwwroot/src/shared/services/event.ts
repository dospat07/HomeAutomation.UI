
export interface Handler{
    (data?:any):void;
}

export default class Event
{
    private handlers:Handler[]  = [];
    public on(handler:Handler)
    {
            this.handlers.push(handler);
    }

    public off(handler:Handler)
    {
         this.handlers = this.handlers.filter(h => h !== handler);
    }

    public raise(data?:any)
    {
         this.handlers.slice(0).forEach(h => h(data));
    }
}