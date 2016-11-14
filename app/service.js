var $ = require("jquery");
var promise = require("es6-promise");
var resourceUrl = "http://localhost:8080/api/database";

module.exports = {
    get: function (data) {
        data.actionType = 'get';
        var Promise = promise.Promise;
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: resourceUrl,
                method: "PUT",
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json",
                success: resolve,
                error: reject
            });
        });
    },

    add: function (data, callback) {
        data.actionType = 'update';
        var Promise = promise.Promise;
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: resourceUrl,
                data: JSON.stringify(data),
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                success: resolve,
                error: reject
            });
        }).then(function(data) {
            callback(data);
        });
    },

    update: function (data, callback) {
        data.actionType = 'update';
        var Promise = promise.Promise;
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: resourceUrl,
                data: JSON.stringify(data),
                method: "PUT",
                dataType: "json",
                contentType: "application/json",
                success: resolve,
                error: reject
            });
        }).then(function(data) {
            callback(data);
        });
    },

    destroy: function (data, callback) {
        data.actionType = 'delete';
        var Promise = promise.Promise;
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: resourceUrl,
                data: JSON.stringify(data),
                method: "PUT",
                dataType: "json",
                contentType: "application/json",
                success: resolve,
                error: reject
            });
        }).then(function(data) {
            callback(data);
        });
    }
}
