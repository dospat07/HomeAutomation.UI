import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import Http from '../shared/services/auth-http.service'
import Config from '../shared/services/config'
import EventBus, { EventType } from '../shared/services/event-bus';
@Component({
    name: 'Command',
    template: require("./command.html"),
    props: {
        deviceID: Number
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
    // private modeColor: string = 'red'
    private fans: Array<string> = ["Auto", "1", "2", "3", "4", "5", "6"];
    private deviceID: number;
    private eventBus = EventBus.Instance;


    public upTemperature() {
        this.temperature = this.temperature < 30 ? this.temperature + 1 : this.temperature;

    }

    public downTemperature() {
        this.temperature = this.temperature > 16 ? this.temperature - 1 : this.temperature;
    }

    
    public upMode() {
        if (this.mode == 2) {
            this.mode = 0;
          //  this.modeColor = 'red';
        } else {
            this.mode++;
           // this.modeColor = 'green';
        }

    }
   
   public get modeColor():string{
       return this.mode===0?'red':'green';
   }
    public downMode() {
        if (this.mode == 0) {
            this.mode = 2;
           
        } else {
            this.mode--;
            
        }

    }
    public downFan() {
        if (this.fan == 0) {
            this.fan =6
        } else {
            this.fan--;
        }

    }
  
  public upFan() {
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

        console.log(this.deviceID, "Fan", this.fan, 'Mode', this.mode, 'temp', this.temperature, "schedule", this.schedule, "time", this.time);
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
                    DeviceID: this.deviceID,
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
            url = Config.DevicesUrl + '/' + this.deviceID;

        }
        let http = new Http();
    
        http.request( url,"POST",(r)=>{console.log(r)},(error)=>{
            var msg = {
                message :error.responseJSON.detail
            }
            console.log(msg);
            this.eventBus.send( EventType.Error,msg)
        },
        JSON.stringify(data)
        );
      

    }


}