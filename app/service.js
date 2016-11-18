var axios = require("axios");
var promise = require("es6-promise");
var resourceUrl = "http://localhost:8080/api/database";
import Cookies from './cookies.js';

module.exports = {
    get: function (data) {
        data.actionType = 'get';
        data.token = Cookies.token;
        return axios.put(resourceUrl, data).then((response) => {
            return response.data;
        });
    },

    add: function (data, callback) {
        data.actionType = 'update';
        data.token = Cookies.token;
        return axios.post(resourceUrl, data).then((response) => {
            callback(response.data);
        });
    },

    update: function (data, callback) {
        data.actionType = 'update';
        data.token = Cookies.token;
        return axios.put(resourceUrl, data).then((response) => {
            callback(response.data);
        });
    },

    destroy: function (data, callback) {
        data.actionType = 'delete';
        data.token = Cookies.token;
        return axios.put(resourceUrl, data).then((response) => {
            callback(response.data);
        });
    }
}
