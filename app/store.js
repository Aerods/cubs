import dispatcher from "./dispatcher";
import { EventEmitter } from "events";
import * as service from "./service";

class Store extends EventEmitter {
    constructor() {
        super()
        this.data = [];
    }

    get(data) {
        service.get(data, (response) => {
            this.data = response;
            this.emit((data.dataName || data.dataType) + "-get");
        });
    }

    add(data) {
        service.add(data, (response) => {
            this.data = response;
            this.emit((data.dataName || data.dataType) + "-add");
        });
    }

    update(data) {
        service.update(data, (response) => {
            this.data = response;
            this.emit((data.dataName || data.dataType) + "-update");
        });
    }

    destroy(data) {
        service.destroy(data, (response) => {
            this.data = response;
            this.emit((data.dataName || data.dataType) + "-destroy");
        });
    }
}

const store = new Store;

dispatcher.register(function (payload) {
    switch (payload.type) {
        case "GET":
            store.get(payload.data);
            break;
        case "ADD":
            store.add(payload.data);
            break;
        case "UPDATE":
            store.update(payload.data);
            break;
        case "DESTROY":
            store.destroy(payload.data);
            break;
    }
});

export default store;
