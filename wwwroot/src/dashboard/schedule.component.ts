import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import EventBus, { EventType } from '../shared/services/event-bus';

import HttpService from '../shared/services/oauth-http.service'
// import { RoomTemperature } from './room-temperture'
import BindingSource from '../shared/services/binding-source'
import Paginator from '../shared/services/paginator'
import VuePaginator from '../shared/components/vue-paginator'
import { ScheduleItem } from './schedule-item'
import Config from "../shared/services/config"

@Component({
    name: 'Schedule',
    template: require("./schedule.html"),
    components: {
        'paginator': VuePaginator,

    }
})


export default class Schedule extends Vue {


    bindingSource = new BindingSource<ScheduleItem>('id');
    paginator: Paginator<ScheduleItem>;




    columns = [
        { name: 'room', header: 'Room' },
        { name: 'time', header: 'Time' },
        { name: 'days', header: "Days" },
        { name: 'temperature', header: "Temp" },
        { name: 'fan', header: "Fan" },
        { name: 'mode', header: "Mode" }
    ];


    private http: HttpService<ScheduleItem>;
    private eventBus = new EventBus();

    constructor() {
        super();
        this.http = new HttpService<ScheduleItem>(Config.ScheduleUrl)
        
        this.eventBus.on(EventType.ScheduleCreated, data => this.addItem(data));
        this.eventBus.on(EventType.ScheduleDeleted, data => this.bindingSource.delete(Number(data)));


        this.paginator = new Paginator(this.bindingSource, 5);
        this.http.getItems((schedule) => this.addItem(schedule)
            , () => {

            });

    }

    public addItem(schedule: any) {
       
        this.bindingSource.add(schedule);
    }

    public deleteSchedule(item: ScheduleItem) {

        this.http.delete(item);
    }








}

