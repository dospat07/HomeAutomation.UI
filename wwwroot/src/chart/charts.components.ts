import Vue from "vue"
import { Component } from 'vue-property-decorator'
import Chart from "chart.js/dist/chart.min"
@Component({
    name: 'Charts',
    template: require("./charts.html")


})
export default class Charts extends Vue {

    options = {
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


    data = {
        labels: ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7.00", "8.00", "9.00", "10.00", "11.00", "12.00"],
        datasets: [{
            label: 'Hall',
            data: [21.5, 22, 22, 23, 21, 20.5, 19.6, 20, 21.0, 22, 21.5, 22.0, 22.0, 21.0, 20, 17.9, 18, 19, 20, 21, 22, 22, 21, 20],
          
            borderColor: "rgba(192,195,106,1)",
            backgroundColor: "rgba(192,195,106,1)",
            borderWidth: 1,
            fill:false
        },
        {
            label: 'Kitchen',
            data: [21.5 - 0.5, 22 - 0.5, 22 - 0.5, 23 - 0.5, 21 - 0.5, 20.5 - 0.5, 19.6 - 0.5, 20 - 0.5, 21.0 - 0.5, 22 - 0.5, 21.5 - 0.5, 22.0 - 0.5, 22.0 - 0.5, 21.0 - 0.5, 20 - 0.5, 17.9 - 0.5, 18 - 0.5, 19 - 0.5, 20 - 0.5, 21 - 0.5, 22 - 0.5, 22 - 0.5, 21 - 0.5, 20 - 0.5],
          
            borderColor: "rgba(90,155,212,1)",
            backgroundColor: "rgba(90,155,212,1)",
            borderWidth: 1,
             fill:false
        }]
    }
  
    dailyChart: any
    dailyChartDate = new Date().toISOString().split('T')[0];

    public mounted() {

        let ctx = document.getElementById("dailyChart");
        this.dailyChart = new Chart(ctx, {
            type: 'line',
            data: this.data,
            options: this.options
        });
        this.loadDailyChart();
    }

    public loadDailyChart() {
        this.data.datasets.forEach((value, index, arr) => {
            value.data.forEach((v, i, a) => {

                a[i] = Math.floor(Math.random() * 15) + 15;

            })
        })
        this.dailyChart.update();;

    }

}