var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
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

exports.getUser = function(data, done) {
    var where = 'WHERE 1';
    var values = [];
    if (data.parent_id) { where += ' and p.id = ?'; values.push(data.parent_id); }

    var query = '                               \
        SELECT p.`group`, p.section, GROUP_CONCAT(cp.cub_id) as cub_ids  \
        FROM parents p                          \
        LEFT JOIN cub_parents cp ON p.id=cp.parent_id \
        '+where+'                               \
    ';
    db.get().query(query, values, function (err, rows) {
        if (err) return done(err)

        var sections = rows[0].section.split(',');
        rows[0].sections = '';
        sections.map(function(section, key) {
            if (sections.length>1) rows[0].sections += "'"+section+"',";
            else rows[0].sections = section;
            if (key+1 == sections.length) {
                rows[0].sections = rows[0].sections.replace(/,\s*$/, "");
                done(null, rows)
            }
        });
    })
}
