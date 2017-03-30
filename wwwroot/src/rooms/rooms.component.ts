import Vue from 'vue'
import VueTable, { Row } from '../shared/components/vue-table'
import { Component, Watch } from 'vue-property-decorator'
import EventBus, { EventType } from '../shared/services/event-bus';
import { Room } from './room'
import HttpService from '../shared/services/http.service'
import { RoomTemperature } from './room-temperture'

@Component({
    name: 'Rooms',
    template: require("./rooms.html"),
    components: { 'vue-table': VueTable }

})

export default class Rooms extends Vue {

    search: string = "";
    rooms: Room[] = [];
   
    columns = ['Name', 'AirCondition', 'Temperature', 'NodeAddress'];
     

    private room = new Room();
    private http: HttpService<Room>;
    private eventBus = new EventBus();

    constructor() {
        super();
        this.http = new HttpService<Room>("http://localhost:5001/api/Rooms");
        this.eventBus.on(EventType.RoomCreated, data => this.onAddRoom(<Room>data));
        this.eventBus.on(EventType.RoomDeleted, data => this.onDeleteRoom(Number(data)));
        this.eventBus.on(EventType.RoomUpdated, data => this.onUpdateRoom(<Room>data));
        this.eventBus.on(EventType.TemperatureUpdated, data => this.onUpdateTemperture(<RoomTemperature>data));
        this.eventBus.on(EventType.Search, data => this.onSearch(data));

        this.http.getArray(this.rooms);
        console.log("Rooms constructor");
    }

    private onSearch(data:string)
    {
            this.search = data;
    }
    private onUpdateTemperture(data: RoomTemperature) {
        console.log("temp");
         console.log(this);
        let i = this.rooms.findIndex(o => o.Name === data.RoomName);
        this.rooms[i].Temperature = data.Temperature;
    };

    private onUpdateRoom(data: Room) {

        let i = this.rooms.findIndex(o => o.ID === data.ID);
        this.rooms[i].AirCondition = data.AirCondition;
        this.rooms[i].Name = data.Name;
        this.rooms[i].NodeAddress = data.NodeAddress;

    };

    private onAddRoom(data: Room) {
        this.rooms.push(data);
    }

    private onDeleteRoom(id: number) {
        let i = this.rooms.findIndex(o => o.ID === id);
        this.rooms.splice(i, 1);
    }

    public selectedRoomChanged(room: Row) {

        this.setSelectedRoom(room);
    }

    public addRoom() {
        this.http.add(this.room);
    }

    public updateRoom() {
        this.http.update(this.room);

    }

    public deleteRoom() {
        this.http.delete(this.room);

    }

    private setSelectedRoom(room: Row) {

        if (room !== undefined) {

            this.room = jQuery.extend({}, room);
        }
    }

    @Watch('$route')
    public onRouteChanged(route: any) {
        console.log("route changed");
        if (route.params.roomID !== undefined) {
            var id = Number(route.params.roomID);
            let i = this.rooms.findIndex(o => o.ID === id);
            this.setSelectedRoom(this.rooms[i]);

        }


    }
}

