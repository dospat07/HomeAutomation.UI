import Event from './event'

export interface Entity {
    [key: string]: any
}

export default class BindingSource<T extends Entity> {

    dataSource: Array<T>;
    filter: string = '';

    sortOrder: any = {};
    sortColumn: string = '';
    position: number = -1;
    public currentChanged: Event = new Event();
    private _current: T = null;
    constructor(private key: string, source?: T[]) {
        if (source === undefined) {
            this.dataSource = new Array<T>();
        
        }
        else {
            this.dataSource = source;
        }

    }

    public sortBy(column: string) {

        if (this.sortOrder[column] === undefined) {
            this.sortOrder[column] = -1;
        }
        this.sortColumn = column;
        this.sortOrder[column] = this.sortOrder[column] * -1;
        this.dataSource.sort((a, b) => {

            let tempa = a[column];
            let tempb = b[column];
            return (tempa === tempb ? 0 : tempa > tempb ? 1 : -1) * this.sortOrder[column];

        });
    };

    public set current(item: T) {
        this._current = item;
        if (item === null){
            this.position = -1;
        }else{
            this.position = this.dataItems.findIndex(o => o[this.key] === item[this.key]);
        }
        this.currentChanged.raise(item);
    }

    public get current(): T {
        return this._current;
    }

    public moveTo(id: any) {
        let item = <T>this.dataSource.find(o => o[this.key] === id);
    
        if (item != undefined)
            this.current = item;

    }
    public get dataItems() {


        var items = [];
        if (this.filter === '') {
            items = this.dataSource;
        }
        else {
            items = this.dataSource.filter((item) => {
                for (let prop in item) {
                    if (item.hasOwnProperty(prop)) {
                        let propValue = item[prop];
                        let result = (<string>propValue).toString().indexOf(this.filter)
                        if (result >= 0) return true;
                    }

                }
                return false;
            })

        }

        return items;
    };

    public add(item: T) {
     
        this.dataSource.push(item);
    }

    public update(item: T) {
       
        let index = this.dataSource.findIndex(o => o[this.key] === item[this.key]);
       
        if (index >= 0) {
            for (let property in item) {
                this.dataSource[index][property] = item[property];
            }
          
        }
    }

    public delete(id: any) {
        let index = this.dataSource.findIndex(o => o[this.key] === id);
        if (index >= 0) {
            if (this.dataSource[index] == this.current) {
                this.current = null;
            }
            this.dataSource.splice(index, 1);
        }
    }
    public findFirst(predicate: { (value: T): boolean }) {
        let index = this.dataItems.findIndex(predicate);
        return this.dataItems[index];
    }

}