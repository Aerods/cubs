var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 1;
    if (data.id) { where += (' and p.id =' + data.id); }
    if (data.cub_id) { where += (' and cp.cub_id =' + data.cub_id); }

    var query = '                                       \
        SELECT p.*, "'+data.cub_id+'" as cub_id         \
        FROM parents p                                  \
        LEFT JOIN cub_parents cp on p.id = cp.parent_id      \
        where '+where+'                                 \
        AND deleted = 0                                 \
        GROUP BY p.id                                   \
    ';
    db.get().query(query, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
