var dispatcher = require("./dispatcher");
var service = require("./service");

function Store() {
    var listeners = [];

    function onChange(data, listener) {
        get(data, listener);
    }

    function get(data, cb) {
        service.get(data).then(function (res) {
            cb(res);
        });
    }

    function add(data, callback) {
        service.add(data, function(data) {
            callback(data);
        }).then(function (res) {
            triggerListeners();
        });
    }

    function update(data, callback) {
        service.update(data, function(data) {
            callback(data);
        }).then(function (res) {
            triggerListeners();
        });
    }

    function destroy(data, callback) {
        service.destroy(data, function(data) {
            callback(data);
        }).then(function (res) {
            triggerListeners();
        });
    }

    function triggerListeners() {
        get(function (res) {
            listeners.forEach(function (listener) {
                listener(res);
            });
        });
    }

    dispatcher.register(function (payload, callback) {
        switch (payload.type) {
            case "ADD":
                add(payload.data, function(data) {
                    callback(data);
                });
                break;
            case "UPDATE":
                update(payload.data, function(data) {
                    callback(data);
                });
                break;
            case "DESTROY":
                destroy(payload.data, function(data) {
                    callback(data);
                });
                break;
        }
    });

    return {
        onChange: onChange
    }
}

module.exports = Store();
