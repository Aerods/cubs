var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 'WHERE deleted = 0';
    values = [];
    if (data.id) { where += ' and id = ?'; values.push(data.id); }
    if (data.section) { where += ' and (section = ? or section is null)'; values.push(data.section); }
    if (data.purpose == 'progress') { where += ' and type != ?'; values.push('core'); }

    var query = 'SELECT * FROM badges ' + where + ' ORDER BY ordering, name';
    db.get().query(query, values, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
