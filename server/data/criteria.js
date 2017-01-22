var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 'WHERE bc.deleted = 0';
    if (data.id) { where += (' and bc.id = ' + data.id); }
    if (data.badge_id) { where += (' and bc.badge_id = ' + data.badge_id); }

    var query;
    if (data.cub_id)  {
        query = '                                                                                           \
            SELECT bc.*, IF(cbc.id, 1, 0) as selected                                                       \
            FROM badge_criteria bc                                                                          \
            LEFT JOIN cub_badge_criteria cbc ON bc.id=cbc.badge_criteria_id and cbc.cub_id='+data.cub_id+'  \
            ' + where + '                                                                                   \
            ORDER BY bc.ordering, bc.id                                                                     \
        ';
    } else {
        query = 'SELECT * FROM badge_criteria bc ' + where;
    }
    db.get().query(query, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
