import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import Http from '../shared/services/oauth-http.service'
import Config from '../shared/services/config'

@Component({
    name: 'Command',
    template: require("./command.html"),
    props: {
        roomID: Number
    },

})
export default class Command extends Vue {
    private temperature = 22;
    private fan = 0;
    private mode = 0;
    private schedule = false;
    private mon = false;
    private tue = false;
    private wed = false;
    private thu = false;
    private fri = false;
    private sat = false;
    private sun = false;
    private time = "08:00";
    private modes: Array<string> = ["Off", "Heat", "Cool"];
    private modeColor: string = 'red'
    private fans: Array<string> = ["Auto", "1", "2", "3", "4", "5", "6"];
    private roomID: number;


    public up() {
        this.temperature = this.temperature < 30 ? this.temperature + 1 : this.temperature;

    }

    public down() {
        this.temperature = this.temperature > 16 ? this.temperature - 1 : this.temperature;
    }

    public setMode() {
        if (this.mode == 2) {
            this.mode = 0;
            this.modeColor = 'red';
        } else {
            this.mode++;
            this.modeColor = 'green';
        }

    }

    public setFan() {
        if (this.fan == 6) {
            this.fan = 0
        } else {
            this.fan++;
        }

    }

    public get canSet():boolean{
        return    (this.schedule&&(this.mon || this.tue || this.wed || this.thu || this.fri || this.sat || this.sun))|| !this.schedule ;
    }
    public set() {

        console.log(this.roomID, "Fan", this.fan, 'Mode', this.mode, 'temp', this.temperature, "scheule", this.schedule, "time", this.time);
        let url: string;
        let data = {
            Temperature: this.temperature,
            Fan: this.fan,
            Mode: this.mode
        }
        if (this.schedule) {
         

                $.extend(data, {

                    Fan: this.fan,
                    Mode: this.mode,
                    RoomID: this.roomID,
                    Time: this.time,
                    Mon: this.mon,
                    Tue: this.tue,
                    Wed: this.wed,
                    Thu: this.thu,
                    Fri: this.fri,
                    Sat: this.sat,
                    Sun: this.sun
                });
                url = Config.ScheduleUrl;
            


        }
        else {
            url = Config.RoomsUrl + '/' + this.roomID;

        }
        let http = new Http();
     //   let r = await http.ajaxAsync("POST", JSON.stringify(data));
        http.request( url,"POST",(r)=>{console.log(r)},(error)=>{console.log(error)},JSON.stringify(data))
        //console.log("result", r);

    }


}