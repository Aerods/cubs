var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = ' WHERE bt.deleted = 0';
    if (data.id) { where += (' and bt.id =' + data.id); }
    if (data.badge_criteria_id) { where += (' and bt.badge_criteria_id =' + data.badge_criteria_id); }

    var query;
    if (data.cub_id) {
        query = '                                                                                           \
            SELECT bt.*, IF(cbt.id, 1, 0) as selected                                                       \
            FROM badge_tasks bt                                                                             \
            LEFT JOIN cub_badge_tasks cbt ON bt.id=cbt.badge_task_id and cbt.cub_id='+data.cub_id+'  \
            ' + where + '                                                                                   \
        ';
    } else {
        query = 'SELECT * FROM badge_tasks bt' + where;
    }
    db.get().query(query, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
