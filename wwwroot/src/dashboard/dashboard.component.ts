import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import EventBus, { EventType } from '../shared/services/event-bus';
import BindingSource from '../shared/services/binding-source'
import HttpService from '../shared/services/oauth-http.service'
import { Room } from '../rooms/room'
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

    public room = new Room();
    bindingSource = new BindingSource<Room>('id');
    private http: HttpService<Room>;
    private eventBus = EventBus.Instance;


    constructor() {
        super();
        this.http = new HttpService<Room>(Config.RoomsUrl);

        this.eventBus.on(EventType.RoomCreated, data => this.bindingSource.add(data));
        this.eventBus.on(EventType.RoomDeleted, data => this.bindingSource.delete(Number(data)));
        this.eventBus.on(EventType.RoomUpdated, data => this.bindingSource.update(data));
        this.eventBus.on(EventType.TemperatureUpdated, data => {
            let room = this.bindingSource.findFirst(o => o.name === data.roomName);
            if (room !== undefined) {

                room.temperature = data.temperature;
            }
        })
        this.bindingSource.currentChanged.on(room => this.onBindingSourceCurrentChanged(room));

        this.init();
      
    }

    public onBindingSourceCurrentChanged(room: Room): void {
        this.room = room;
    }
    public selectFirstRoom() {

        this.room = this.bindingSource.dataItems[0];
    }

    public init= ()=> {
        //console.log("Arrow init",this);
        this.http.getItems((room) => this.bindingSource.add(room), () => this.selectFirstRoom());
    }

    






}
