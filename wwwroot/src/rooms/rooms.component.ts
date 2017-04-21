import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import EventBus, { EventType } from '../shared/services/event-bus';
import { Room } from './room'
import HttpService from '../shared/services/http.service'
// import { RoomTemperature } from './room-temperture'
import BindingSource from '../shared/services/binding-source'
import Paginator from '../shared/services/paginator'
import VuePaginator from '../shared/components/vue-paginator'
import VueDialog from '../shared/components/vue-dialog'
import MessageDialog from '../shared/services/message-dialog'

@Component({
    name: 'Rooms',
    template: require("./rooms.html"),
    components: {
        'paginator': VuePaginator,
        'v-dialog': VueDialog
    }

})


export default class Rooms extends Vue {

    public get dataItems(): Array<Room> {

        return null;
    }

    bindingSource = new BindingSource<Room>('ID');
    paginator: Paginator<Room>;
    dialog: MessageDialog = new MessageDialog();



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
        this.http = new HttpService<Room>("http://localhost:5001/api/Rooms", {
            handle(status: number, statusText: string) {
                console.log(status, ' ', statusText);
            }
        });
        this.eventBus.on(EventType.RoomCreated, data => this.bindingSource.add(data));
        this.eventBus.on(EventType.RoomDeleted, data => this.bindingSource.delete(Number(data)));
        this.eventBus.on(EventType.RoomUpdated, data => this.bindingSource.update(data));
        this.eventBus.on(EventType.TemperatureUpdated, data => {
            let room = this.bindingSource.findFirst(o => o.Name === data.RoomName);
            if (room !== undefined) {
                room.Temperature = data.Temperature;
            }
        })
        this.eventBus.on(EventType.Search, data => this.onSearch(data));
        this.bindingSource.currentChanged.on(room => this.onBindingSourceCurrentChanged(room));
        this.paginator = new Paginator(this.bindingSource, 5);
        this.http.getItems((room) => this.bindingSource.add(room), () => {
            this.bindingSource.moveTo(Number(this.$route.params.roomID));
        });
        console.log("Rooms constuctor");

    }


    private onBindingSourceCurrentChanged(room: Room) {

        //  this.dialog.showMessage(room.Name,room.NodeAddress);
        this.selectedRoom = room;
    }
    private onSearch(data: string) {

        this.bindingSource.filter = data;
    }

    public addRoom() {

        this.http.add(this.room);
    }

    public updateRoom() {
        $('#messageDialog').modal({ show: true });
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

    @Watch('$route')
    private onRouteChanged(route: any) {

        this.bindingSource.moveTo(Number(route.params.roomID));
    }

}

