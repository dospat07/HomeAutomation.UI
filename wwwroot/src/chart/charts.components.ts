import Vue from "vue"
import   Component  from 'vue-class-component'
import {Watch}   from 'vue-property-decorator'
import EventBus, { EventType } from '../shared/services/event-bus';
import Chart from "chart.js/dist/chart.min"
import Map from "../shared/map"
import HttpService from '../shared/services/http.service'
import Config from '../shared/services/config'

@Component({
    name: 'Charts',
    template: require("./charts.html"), 
    props:{chartType:{type:String}}
   
})
export default  class  Charts extends Vue {
   
    private dailyOptions = {
        responsive: true,
        maintainAspectRatio:false,
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false,
                    // suggestedMin: 15,
                    // suggestedMax: 30
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Temperature C'
                }
            }],
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
        }
    }

    private realTimeOptions = {
      
        responsive: true,
        maintainAspectRatio:false,
        title: {
            display: true,
            text: 'RealTime Data'
        },
     
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },

        
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false,
                    // suggestedMin: 15,
                    // suggestedMax: 30
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Temperature C'
                },
                
            }],
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                  
                }
            }],
        }
    };

    private realTimeData = {
        labels: [],
        datasets: []
    }
 
    public chartType:string;
   
    private chart:Chart =null;
   
    private fromDate = new Date().toISOString().split('T')[0];
    private toDate = new Date().toISOString().split('T')[0];

    private eventBus = EventBus.Instance;
    private map: Map = new Map();
    private colors = ["rgba(90,155,212,1)", "rgba(192,195,106,1)"];
  
    public constructor() {
            
        super();
        this.eventBus.on(EventType.TemperatureUpdated, this.onTemperatureUpdated);    
      
         
    }

    public mounted() {
        
        this.initChart(this.chartType=='Realtime'?true:false);
    }

    public initChart(realTime:boolean)
    {
        if(this.chart==null){
            let chartElement = document.getElementById("chart");
            this.chart = new Chart(chartElement, {
                type: 'line'
            });
        }
        this.chart.data = realTime?this.realTimeData: {labels: [],datasets: []};
        this.chart.options = realTime?this.realTimeOptions:this.dailyOptions;
        this.chart.update();
        
    }

    @Watch('chartType')
    private onChartTypeChanged(chartType:String){
        console.log(chartType);
        this.initChart(this.chartType=='Realtime'?true:false);
    };

    private onTemperatureUpdated(data: any) {
    
        let datasetID = this.map.get(data.name)
    
        if (this.realTimeData.datasets[datasetID] === undefined) {
            this.realTimeData.datasets[datasetID] = {
                label: data.name,
                borderColor: this.colors[datasetID],
                backgroundColor: this.colors[datasetID],
                data: [],
                borderWidth: 1,
                fill: false,
                pointRadius:1,
              
            }
        };

        try{
            this.realTimeData.datasets[datasetID].data.push(data.temperature);
        }catch {
            console.log( datasetID,this.realTimeData.datasets);
        }
       
        if (this.realTimeData.datasets[datasetID].data.length > this.realTimeData.labels.length) {
            let d = new Date();
            let label = d.getHours() + ":" + (d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes());
            this.realTimeData.labels.push(label);
        }
        if (this.chartType =='Realtime'){
            this.chart.update();
        }
       
    
    }
 
    public loadDailyChart() {
     
        this.loadChart(Config.ChartsUrl + "/Daily?from=" + this.fromDate + "&to=" + this.toDate);       
    }

     public loadHourlyChart() {
     
        this.loadChart(Config.ChartsUrl + "/Hourly?from=" + this.fromDate + "&to=" + this.toDate);       
    }

    public loadChart(url:string) {
   
        let http = new HttpService();
        http.request(url, "GET", (data) => {
            console.log(data);
            data.datasets.forEach((value, index, arr) => {
                value["borderColor"] = this.colors[index];
                value["backgroundColor"] = this.colors[index];
                value["borderWidth"] = 1;
                value["fill"] = false;
                value["pointRadius"] =1;

            });
            this.chart.data = data;
            this.chart.update();
        },
            (error) => {
                console.log(error);
            })
    }
   
}