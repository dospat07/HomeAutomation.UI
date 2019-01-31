import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import EventBus, { EventType } from '../shared/services/event-bus';
import BindingSource from '../shared/services/binding-source'
import HttpService from '../shared/services/auth-http.service'
import {Device} from '../devices/device'
import Command from './command.component'
import Schedule from './schedule.component'
import Config from '../shared/services/config'

@Component({
    name: 'Dashboard',
    template: require("./dashboard.html"),
    components: {
        "v-command": Command,
        "v-schedule": Schedule
    }

})
export default class Dashboard extends Vue {

    public device = new Device();
    bindingSource = new BindingSource<Device>('id');
    private http: HttpService<Device>;
    private eventBus = EventBus.Instance;


    constructor() {
        super();
        this.http = new HttpService<Device>(Config.DevicesUrl);

        this.eventBus.on(EventType.DeviceCreated, data => this.bindingSource.add(data));
        this.eventBus.on(EventType.DeviceDeleted, data => this.bindingSource.delete(Number(data)));
        this.eventBus.on(EventType.DeviceUpdated, data => this.bindingSource.update(data));
        this.eventBus.on(EventType.TemperatureUpdated, data => {
            let device = this.bindingSource.findFirst(o => o.name === data.name);
            if (device !== undefined) {

                device.temperature = data.temperature;
            }
        })
        this.bindingSource.currentChanged.on(device => this.onBindingSourceCurrentChanged(device)); 
        this.http.get((items)=>{this.bindingSource.addArray(items)});
    
    }

    public onBindingSourceCurrentChanged(device: Device): void {
        this.device = device;
    }
     

    






}
