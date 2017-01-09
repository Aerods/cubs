var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 1;
    var values = [];
    if (data.id) { where += ' and id = ?'; values.push(data.id); }
    if (data.section) { where += ' and section = ?'; values.push(data.section); }
    if (data.group) { where += ' and `group` = ?'; values.push(data.group); }

    var query = '                                       \
        SELECT *                                        \
        FROM leaders                                    \
        where '+where+'                                 \
        AND deleted = 0                                 \
    ';
    db.get().query(query, values, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
