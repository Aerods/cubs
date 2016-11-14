var db = require('../../db.js')
var server = require('../server.js')
var promise = require("es6-promise");
var Promise = promise.Promise;

exports.create = function(data_table, type, data, done) {
    return new Promise(function (resolve, reject) {
        db.get().query('SELECT count(*) as count from action_log where data_table = ? and type = ? and data = ?', [data_table, type, JSON.stringify(data)], function(err, result) {
            resolve(result[0].count);
        });
    }).then(function(count) {
        if (type != 'insert' || !count) {
            db.get().query('INSERT INTO action_log (data_table, type, data) VALUES(?, ?, ?)', [data_table, type, JSON.stringify(data)], function(err, result) {
                done();
            });
        }
    });
}
