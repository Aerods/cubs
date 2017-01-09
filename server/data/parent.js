var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 1;
    var where = 'WHERE deleted = 0';
    var values = [];
    if (data.id) { where += ' and p.id = ?'; values.push(data.id); }
    if (data.section && !data.allSections) { where += ' and section like ?'; values.push('%'+data.section+'%'); }
    if (data.group) { where += ' and `group` = ?'; values.push(data.group); }
    if (data.cub_id) { where += ' and cp.cub_id = ?'; values.push(data.cub_id); }

    var query = '                                       \
        SELECT p.*, "'+data.cub_id+'" as cub_id         \
        FROM parents p                                  \
        LEFT JOIN cub_parents cp on p.id = cp.parent_id \
        '+where+'                                       \
        GROUP BY p.id                                   \
    ';
    db.get().query(query, values, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
