var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 1;
    var values = [];
    if (data.id) { where += ' and id = ?'; values.push(data.id); }
    if (data.section) { where += ' and section = ?'; values.push(data.section); }
    if (data.sections) { where += ' and (section in (?) or section is null)'; values.push(data.sections); }
    if (data.group) { where += ' and `group` = ?'; values.push(data.group); }

    var query = '                                       \
        SELECT *                                        \
        FROM leaders                                    \
        WHERE '+where+'                                 \
        AND deleted = 0                                 \
        ORDER BY FIELD(position, "SL", "CSL", "BSL", "ASL", "ACSL", "ABSL", "GSL", "AGSL", "SA", "OH", "YL") \
    ';
    db.get().query(query, values, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
