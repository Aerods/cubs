var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 1;
    var values = [];
    if (data.id) { where += ' and p.id = ?'; values.push(data.id); }
    if (data.section) { where += ' and section = ?'; values.push(data.section); }
    if (data.group) { where += ' and `group` = ?'; values.push(data.group); }

    var query = '                                       \
        SELECT                                          \
            p.id,                                         \
            DATE_FORMAT(date, "%Y%m%d") as orderByDate,    \
            DATE_FORMAT(date, "%d/%m/%Y") as date,      \
            title,                                      \
            type,                                       \
            location,                                   \
            details,                                    \
            TIME_FORMAT(start_time, "%H:%i") as start_time,  \
            TIME_FORMAT(end_time, "%H:%i") as end_time, \
            DATE_FORMAT(end_date, "%d/%m/%Y") as end_date,    \
            SUM(pc.id) as old                                \
        FROM programme p                                 \
        LEFT JOIN programme_cubs pc ON p.id=pc.programme_id \
        WHERE '+where+'                                 \
        GROUP BY p.id                                     \
        ORDER BY orderByDate                                     \
    ';
    db.get().query(query, values, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
