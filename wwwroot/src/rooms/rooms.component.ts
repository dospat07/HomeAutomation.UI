import Vue from 'vue'

import { Component, Watch } from 'vue-property-decorator'
import EventBus, { EventType } from '../shared/services/event-bus';
import { Room } from './room'
import HttpService from '../shared/services/http.service'
import { RoomTemperature } from './room-temperture'
import BindingSource from '../shared/services/binding-source'

@Component({
    name: 'Rooms',
    template: require("./rooms.html")


})

export default class Rooms extends Vue {


    rooms: Room[] = [];
    bindingSource = new BindingSource<Room>(this.rooms, 'ID');


    columns = [
        { name: 'Name', header: 'Room' },
        { name: 'AirCondition', header: 'Conditioner' },
        { name: 'Temperature', header: 'Temperature' },
        { name: 'NodeAddress', header: 'NodeAddress' },

    ];

    private room = new Room();
    private http: HttpService<Room>;
    private eventBus = new EventBus();



    constructor() {
        super();
        this.http = new HttpService<Room>("http://localhost:5001/api/Rooms");
        this.eventBus.on(EventType.RoomCreated, data => this.bindingSource.add(data));
        this.eventBus.on(EventType.RoomDeleted, data => this.bindingSource.delete(Number(data)));
        this.eventBus.on(EventType.RoomUpdated, data => this.bindingSource.update(data));
        this.eventBus.on(EventType.TemperatureUpdated, data => this.bindingSource.findFirst(o => o.Name === data.RoomName).Temperature = data.Temperature);
        this.eventBus.on(EventType.Search, data => this.onSearch(data));
        this.bindingSource.currentItemChanged.on(room => this.onBindingSourceCurrentItemChanged(room));
        this.http.getArray(this.rooms);

        console.log("Rooms constructor");
    }

    private  onBindingSourceCurrentItemChanged(room: Room) {
        this.selectedRoom = room
    }
    private onSearch(data: string) {
        this.bindingSource.filter = data;
    }

    @Watch('$route')
    private onRouteChanged(route: any) {
        console.log("route changed");
        if (route.params.roomID !== undefined) {
            var id = Number(route.params.roomID);
            let i = this.rooms.findIndex(o => o.ID === id);
            this.bindingSource.current = this.rooms[i];

        }
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

    public get selectedRoom() {
        return this.room;
    }

    public set selectedRoom(room: Room) {

        if (room !== undefined) {

            this.room = jQuery.extend({}, room);
        }
    }

}

