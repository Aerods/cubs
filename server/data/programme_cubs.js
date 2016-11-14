var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 'WHERE c.deleted = 0';
    var query = '                           \
        SELECT                              \
            c.id,                           \
            forename,                       \
            surname,                        \
            DATE_FORMAT(date_of_birth, "%d/%m/%Y") as date_of_birth,    \
            gender,                         \
            rank,                           \
            six,                            \
            IF(pc.id, 1, 0) as selected     \
        FROM cubs c                         \
        LEFT JOIN programme_cubs pc on c.id=pc.cub_id                   \
            AND pc.programme_id='+data.programme_id+'                   \
        '+where+'                           \
        ORDER BY date_of_birth';
    db.get().query(query, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
