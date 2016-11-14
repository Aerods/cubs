var Guid = require("guid");
var listeners = {};

function dispatch(payload, callback) {
    for (var id in listeners) {
        listeners[id](payload, function(data) {
            callback(data);
        });
    }
}

function register(cb) {
    var id = Guid.create();
    listeners[id] = cb;
}

module.exports = {
    register: register,
    dispatch: dispatch
}
