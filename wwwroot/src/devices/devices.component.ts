import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import EventBus, { EventType } from '../shared/services/event-bus';
import { Device } from './device'
import HttpService from '../shared/services/oauth-http.service'
import BindingSource from '../shared/services/binding-source'
import Paginator from '../shared/services/paginator'
import VuePaginator from '../shared/components/vue-paginator'
import VueDialog from '../shared/components/vue-dialog'
import MessageDialog,{Buttons} from '../shared/services/message-dialog'
import Config from '../shared/services/config'

@Component({
    name: 'Devices',
    template: require("./devices.html"),
    components: {
        'paginator': VuePaginator,
        'v-dialog': VueDialog
    }
})


export default class Devices extends Vue {

    public get dataItems(): Array<Device> {

        return null;
    }

    bindingSource = new BindingSource<Device>('id');
    paginator: Paginator<Device>;
    dialog: MessageDialog = new MessageDialog();



    columns = [
        { name: 'name', header: 'Name' },
        { name: 'appliance', header: 'Appliance' },
        { name: 'nodeAddress', header: 'Address' },
    ];

    private device = new Device();
  
    private eventBus = EventBus.Instance;
    private http= new  HttpService<Device>(Config.DevicesUrl,this.dialog);
    constructor() {
        super();
       
        this.eventBus.on(EventType.DeviceCreated, data => this.bindingSource.add(data));
        this.eventBus.on(EventType.DeviceDeleted, data => this.bindingSource.delete(Number(data)));
        this.eventBus.on(EventType.DeviceUpdated, data => this.bindingSource.update(data));
    
        this.eventBus.on(EventType.Search, data => this.onSearch(data));
        this.bindingSource.currentChanged.on(device => this.onBindingSourceCurrentChanged(device));
        this.paginator = new Paginator(this.bindingSource, 5);
        this.http.getItems((device) => this.bindingSource.add(device), () => {
            this.bindingSource.moveTo(Number(this.$route.params.roomID));
        });
   
      

    }


    private onBindingSourceCurrentChanged(device: Device) {

       
        this.selectedDevice = device;
    }
    private onSearch(data: string) {

        this.bindingSource.filter = data;
    }

    public addDevice() {

        this.http.post(this.device);
    }

    public updateDevice() {
       
        console.log(this.device);
        this.http.put(this.device);
    }

    public deleteDevice() {

        this.http.delete(this.device);
    }


    public get selectedDevice() {

        return this.device;
    }

    public set selectedDevice(device:Device) {

        if (device !== undefined) {

            this.device = jQuery.extend({}, device);
        }
    }

    @Watch('$route')
    private onRouteChanged(route: any) {

        this.bindingSource.moveTo(Number(route.params.roomID));
    }

}

