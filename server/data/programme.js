var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 1;
    var values = [];
    if (data.id) { where += ' and id = ?'; values.push(data.id); }
    if (data.section) { where += ' and section = ?'; values.push(data.section); }
    if (data.group) { where += ' and `group` = ?'; values.push(data.group); }

    var query = '                                       \
        SELECT                                          \
            id,                                         \
            DATE_FORMAT(date, "%d/%m/%Y") as date,      \
            title,                                      \
            type,                                       \
            location,                                   \
            details,                                    \
            TIME_FORMAT(start_time, "%H:%i") as start_time,  \
            TIME_FORMAT(end_time, "%H:%i") as end_time, \
            DATE_FORMAT(end_date, "%d/%m/%Y") as end_date    \
        FROM programme                                  \
        where '+where+'                                 \
    ';
    db.get().query(query, values, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
