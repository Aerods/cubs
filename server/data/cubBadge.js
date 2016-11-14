var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 1;
    if (data.cub_id) { where += (' and cub_id =' + data.cub_id); }

    var query = '                                       \
        SELECT cb.*, b.name, b.type, b.stage            \
        FROM cub_badges cb                              \
        LEFT JOIN badges b on cb.badge_id = b.id        \
        WHERE '+where+'                                 \
    ';
    db.get().query(query, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
