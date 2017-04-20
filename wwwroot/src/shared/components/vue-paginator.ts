import Vue from 'vue'
import Component from 'vue-class-component'
 

interface Paginator{
    prev():void;
    next():void;
    setPage(page:number):void;
    totalPages:number;
    currentPage:number;
   
}

@Component({
    template: require("./vue-paginator.html"),
    props: {
      paginator:Object
    },
})
export default class VuePaginator  extends Vue {

     private paginator:Paginator ;
    
     public get totalPages(){

         return this.paginator.totalPages ;
     }

     public get currentPage(){
         
         return this.paginator.currentPage;
     }
    public prev() {
        
        this.paginator.prev();
    }
    public next() {
        
          this.paginator.next();
    }
    public page(pageNumber: number) {
     
       this.paginator.setPage(pageNumber);
    }
  
}
