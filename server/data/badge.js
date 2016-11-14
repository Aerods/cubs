var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 'WHERE deleted = 0';
    if (data.id) { where += (' and id =' + data.id); }
    if (data.purpose == 'progress') where += ' and type != "core"';

    var query = 'SELECT * FROM badges ' + where + ' ORDER BY ordering';
    db.get().query(query, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
