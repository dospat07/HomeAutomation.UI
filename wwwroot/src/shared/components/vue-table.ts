

import Vue from 'vue'
import Component from 'vue-class-component'



export interface Row {
  [key: string]: any
}

@Component({

  template: require("./vue-table.html"),
  props: {
   
    dataSource: Array,
    filter: String,
    pageSize: String,
    columns:Array,
    columnTitles:Array

  },
 
   
})
export default class VueTable extends Vue {
  
  dataSource: Array<any>;
  filter: string;
  pageSize: number;
  columns: Array<string>;
  columnTitles: Array<string>;

  private sortOrder: any = {};
  private sortColumn: string = '';
  private page: number = 1;
  private count: number = this.dataSource !== undefined ? this.dataSource.length : 0;
  

 
  public sortBy(column: string) 
  {

    if (this.sortOrder[column] === undefined) {
      this.sortOrder[column] = -1;
    }
    this.sortColumn = column;
    this.sortOrder[column] = this.sortOrder[column] * -1;
    this.dataSource.sort((a, b) => {

      a = a[column];
      b = b[column];
      return (a === b ? 0 : a > b ? 1 : -1) * this.sortOrder[column];
    });
  };

  public nextPage() 
  {
    this.page = this.pageCount >= (this.page + 1) ? this.page + 1 : this.page = 1;
  };

  public prevPage() 
  {
    this.page = this.page < 2 ? this.pageCount : this.page - 1;
  };

  public clickCell(row: Row, column: string) 
  {
     this.selectedChanged(row);
  };

  public get pageCount() 
  {
    return Math.ceil(this.count / this.pageSize);
  };

  public get dataItems() 
  {
   
   console.log("vue-table filter = "+this.filter);
    var items = [];
    if (this.filter === '') 
    {
      items = this.dataSource;
    } 
    else 
    {
      items = this.dataSource.filter((item) => {
        for (var prop in item) {
          if (item.hasOwnProperty(prop)) {
            var propValue = item[prop];
            var result = propValue.toString().indexOf(this.filter)
            if (result >= 0) return true;
          }

        }
        return false;
      })

    }
    this.count = items.length;
    return items.slice((this.page - 1) * this.pageSize, (this.page) * this.pageSize);;
  };

  private selectedChanged(item:Row)
  {
      this.$emit('selectedChanged',item) ;
  }

}

