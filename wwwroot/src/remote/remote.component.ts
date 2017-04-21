import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import EventBus, { EventType } from '../shared/services/event-bus';
import BindingSource from '../shared/services/binding-source'
import HttpService from '../shared/services/http.service'
import { Room } from '../rooms/room'
@Component({
    name: 'Remote',
    template: require("./remote.html"),


})
export default class Remote extends Vue {

    bindingSource = new BindingSource<Room>('ID');
    private http: HttpService<Room>;
    private eventBus = new EventBus();
    private room = new Room();
    private temperature = 22;
    private fan = 0;
    private mode =0;
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
         this.http.getItems((room) => this.bindingSource.add(room), () => {
           // this.bindingSource.moveTo(Number(this.$route.params.roomID));
           console.log(this.bindingSource);
        });
    }

    public send():void{
        console.log(this.room.Name,'Fan',this.fan,'Mode',this.mode,'temp',this.temperature);
    }

}
