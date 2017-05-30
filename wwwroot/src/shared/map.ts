export default class Map {

    private index = 0;
    private _map = {};
    public get(key: string): number {
        let value = this._map[key];
        if (value === undefined) {
            value = this.index;
            this.index++;
            this._map[key] = value;
        }
        return value;
    }
}