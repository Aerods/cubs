var axios = require("axios");
var promise = require("es6-promise");
var resourceUrl = "http://localhost:8080/api/database";

module.exports = {
    get: function (data) {
        data.actionType = 'get';
        return axios.put(resourceUrl, data).then((response, test) => {
            return response.data;
        });
    },

    add: function (data, callback) {
        data.actionType = 'update';
        return axios.post(resourceUrl, data).then((response, test) => {
            callback(response.data);
        });
    },

    update: function (data, callback) {
        data.actionType = 'update';
        return axios.put(resourceUrl, data).then((response, test) => {
            callback(response.data);
        });
    },

    destroy: function (data, callback) {
        data.actionType = 'delete';
        return axios.put(resourceUrl, data).then((response, test) => {
            callback(response.data);
        });
    }
}
