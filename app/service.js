import axios from "axios";
import Cookies from './cookies.js';
var resourceUrl = Cookies.host+'/api/database';

export function get(data, callback) {
    data.actionType = 'get';
    data.token = Cookies.token;
    data.leader_id = Cookies.leader_id;
    return axios.put(resourceUrl, data).then((response) => {
        callback(response.data);
    });
}

export function add(data, callback) {
    data.actionType = 'update';
    data.token = Cookies.token;
    data.leader_id = Cookies.leader_id;
    return axios.post(resourceUrl, data).then((response) => {
        callback(response.data);
    });
}

export function update(data, callback) {
    data.actionType = 'update';
    data.token = Cookies.token;
    data.leader_id = Cookies.leader_id;
    return axios.put(resourceUrl, data).then((response) => {
        callback(response.data);
    });
}

export function destroy(data, callback) {
    data.actionType = 'delete';
    data.token = Cookies.token;
    data.leader_id = Cookies.leader_id;
    return axios.put(resourceUrl, data).then((response) => {
        callback(response.data);
    });
}
