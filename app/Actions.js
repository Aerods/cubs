var dispatcher = require("./dispatcher");

module.exports = {
    add: function(data, callback) {
        dispatcher.dispatch({
            type: "ADD",
            data: data
        }, function(data) {
            callback(data);
        });
    },
    update: function(data, callback) {
        dispatcher.dispatch({
            type: "UPDATE",
            data: data
        }, function(data) {
            callback(data);
        });
    },
    destroy: function(data, callback) {
        dispatcher.dispatch({
            type: "DESTROY",
            data: data
        }, function(data) {
            callback(data);
        });
    }
}
