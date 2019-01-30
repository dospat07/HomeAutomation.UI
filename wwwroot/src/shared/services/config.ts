export default class Config
{
    public static get  Host():string
    {
            let apiServer = (<any> window).apiServer;
          
            return apiServer;
    }
    //public static Host="http://localhost:5001";
    public static ScheduleUrl=Config.Host+"/api/Schedule";
    public static DevicesUrl=Config.Host+"/api/Devices";
    public static ChartsUrl=Config.Host+"/api/Charts";
    public static TokenUrl ="http://localhost:5843/connect/token";
    public static SignalRUrl = Config.Host+"/socket";
}