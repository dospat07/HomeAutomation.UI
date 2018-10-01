import Vue from "vue"
import { Component } from 'vue-property-decorator'
import EventBus, { EventType } from '../shared/services/event-bus';
import Chart from "chart.js/dist/chart.min"
import Map from "../shared/map"
import HttpService from '../shared/services/http.service'
import Config from '../shared/services/config'

@Component({
    name: 'Charts',
    template: require("./charts.html")


})
export default class Charts extends Vue {

    private dailyOptions = {
        responsive: true,
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
        title: {
            display: true,
            text: 'RealTime Data'
        },
        responsive: true,
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
    };
    private realTimeData = {
        labels: [],
        datasets: []
    }

    private dailyChart: any;
    private realTimeChart: any;
    private fromDate = new Date().toISOString().split('T')[0];
    private toDate = new Date().toISOString().split('T')[0];

    private eventBus = EventBus.Instance;
    private map: Map = new Map();
    private colors = ["rgba(90,155,212,1)", "rgba(192,195,106,1)"];


    public constructor() {
        super();
        this.eventBus.on(EventType.TemperatureUpdated, this.onTemperatureUpdated);



    }
    private onTemperatureUpdated(data: any) {

        let datasetID = this.map.get(data.roomName)
        console.log(datasetID);
        if (this.realTimeData.datasets[datasetID] === undefined) {
            this.realTimeData.datasets[datasetID] = {
                label: data.roomName,
                borderColor: this.colors[datasetID],
                backgroundColor: this.colors[datasetID],
                data: [],
                borderWidth: 1,
                fill: false,
                pointRadius:1
            }
        };

        this.realTimeData.datasets[datasetID].data.push(data.temperature);
        if (this.realTimeData.datasets[datasetID].data.length > this.realTimeData.labels.length) {
            let d = new Date();
            let label = d.getHours() + ":" + (d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes());
            this.realTimeData.labels.push(label);
        }
        this.realTimeChart.update();
    }

    public mounted() {

        let dailyChart = document.getElementById("dailyChart");
        this.dailyChart = new Chart(dailyChart, {
            type: 'line',
            //  data: this.dailyData,
            options: this.dailyOptions
        });
        let realTimeChart = document.getElementById("realTimeChart");
        this.realTimeChart = new Chart(realTimeChart, {
            type: 'line',
            data: this.realTimeData,
            options: this.realTimeOptions
        });
     
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
            this.dailyChart.data = data;
            this.dailyChart.update();
        },
            (error) => {
                console.log(error);
            })


    }
   
    public loadDailyChart() {

       
        this.loadChart(Config.ChartsUrl + "/Daily?from=" + this.fromDate + "&to=" + this.toDate);
        
    }

     public loadHourlyChart() {

     
        this.loadChart(Config.ChartsUrl + "/Hourly?from=" + this.fromDate + "&to=" + this.toDate);
        
    }

}