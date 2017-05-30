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

    // private dailyData = {
    //     labels: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7.00", "8.00", "9.00", "10.00", "11.00", "12.00"],
    //     datasets: [{
    //         label: 'Hall',
    //         data: [21.5, 22, 22, 23, 21, 20.5, 19.6, 20, 21.0, 22, 21.5, 22.0, 22.0, 21.0, 20, 17.9, 18, 19, 20, 21, 22, 22, 21, 20],
    //         borderColor: "rgba(192,195,106,1)",
    //         backgroundColor: "rgba(192,195,106,1)",
    //         borderWidth: 1,
    //         fill: false
    //     },
    //     {
    //         label: 'Kitchen',
    //         data: [21.5 - 0.5, 22 - 0.5, 22 - 0.5, 23 - 0.5, 21 - 0.5, 20.5 - 0.5, 19.6 - 0.5, 20 - 0.5, 21.0 - 0.5, 22 - 0.5, 21.5 - 0.5, 22.0 - 0.5, 22.0 - 0.5, 21.0 - 0.5, 20 - 0.5, 17.9 - 0.5, 18 - 0.5, 19 - 0.5, 20 - 0.5, 21 - 0.5, 22 - 0.5, 22 - 0.5, 21 - 0.5, 20 - 0.5],
    //         borderColor: "rgba(90,155,212,1)",
    //         backgroundColor: "rgba(90,155,212,1)",
    //         borderWidth: 1,
    //         fill: false
    //     }]
    // }

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

    private eventBus = new EventBus();
    private map: Map = new Map();
    private colors = ["rgba(90,155,212,1)", "rgba(192,195,106,1)"];


    public constructor() {
        super();
        this.eventBus.on(EventType.TemperatureUpdated, this.onTemperatureUpdated);



    }
    private onTemperatureUpdated(data: any) {

        let datasetID = this.map.get(data.RoomName)
        console.log(datasetID);
        if (this.realTimeData.datasets[datasetID] === undefined) {
            this.realTimeData.datasets[datasetID] = {
                label: data.RoomName,
                borderColor: this.colors[datasetID],
                backgroundColor: this.colors[datasetID],
                data: [],
                borderWidth: 1,
                fill: false
            }
        };

        this.realTimeData.datasets[datasetID].data.push(data.Temperature);
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
      //  this.loadDailyChart();
    }

    public loadDailyChart() {

        // this.dailyData.datasets.forEach((value, index, arr) => {
        //     value.data.forEach((v, i, a) => {

        //         a[i] = Math.floor(Math.random() * 15) + 15;

        //     })
        // })
        let http = new HttpService();
        http.request(Config.ChartsUrl + "?from=" + this.fromDate + "&to=" + this.toDate, "GET", (data) => {
            console.log(data);
            data.datasets.forEach((value, index, arr) => {
                value["borderColor"] = this.colors[index];
                value["backgroundColor"] = this.colors[index];
                value["borderWidth"] = 1;
                value["fill"] = false;

            });
            this.dailyChart.data = data;
            this.dailyChart.update();;
        },
            (error) => {
                console.log(error);
            })


    }

}