import axios from "axios";
import Cookies from './cookies.js';
var resourceUrl = "http://localhost:8080/api/database";

export function get(data, callback) {
    data.actionType = 'get';
    data.token = Cookies.token;
    return axios.put(resourceUrl, data).then((response) => {
        callback(response.data);
    });
}

export function add(data, callback) {
    data.actionType = 'update';
    data.token = Cookies.token;
    return axios.post(resourceUrl, data).then((response) => {
        callback(response.data);
    });
}

export function update(data, callback) {
    data.actionType = 'update';
    data.token = Cookies.token;
    return axios.put(resourceUrl, data).then((response) => {
        callback(response.data);
    });
}

export function destroy(data, callback) {
    data.actionType = 'delete';
    data.token = Cookies.token;
    return axios.put(resourceUrl, data).then((response) => {
        callback(response.data);
    });
}
