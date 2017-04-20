
import BindingSource from '../services/binding-source'

export default class Paginator<T>   {

    public currentPage: number = 1;

    // constructor(private dataSource:Array<T>, public  pageSize: number){}
    constructor(private bindingSource: BindingSource<T>, public pageSize: number) { 

        this.bindingSource.currentChanged.on(()=>this.onCurrentChanged());
    }
   public onCurrentChanged(){

        let page =  Math.floor( this.bindingSource.position / this.pageSize)+1;     
        this.setPage(page);
   }
   
    public next() {

        this.currentPage = this.totalPages >= (this.currentPage + 1) ? this.currentPage + 1 : this.currentPage = 1;
    };

    public prev() {

        this.currentPage = this.currentPage < 2 ? this.totalPages : this.currentPage - 1;
    };

    public setPage(page: number) {

        if (page > 0 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    public get totalPages() {

        let pageCount = Math.ceil( this.bindingSource.dataItems.length / this.pageSize);      
        if (this.currentPage >pageCount && pageCount>0){

            this.currentPage = pageCount;
        }
        return pageCount;
         
    };
   
    public get dataItems() {

        return this.bindingSource.dataItems.slice((this.currentPage - 1) * this.pageSize, (this.currentPage) * this.pageSize);;
    };


}

