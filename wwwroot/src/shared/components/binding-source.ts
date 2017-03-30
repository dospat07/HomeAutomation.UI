 
export default class BindingSource  {
  
  dataSource: Array<any>;
  filter: string;

  private sortOrder: any = {};
  private sortColumn: string = '';

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

  public get dataItems() 
  {
   
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
  
    return items;
  };

  

}