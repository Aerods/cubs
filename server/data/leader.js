var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 1;
    if (data.id) { where += (' and id =' + data.id); }

    var query = '                                       \
        SELECT *                                        \
        FROM leaders                                    \
        where '+where+'                                 \
        AND deleted = 0                                 \
    ';
    db.get().query(query, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
