var db = require('../../db.js')
var server = require('../server.js')
var awardActions = require("../actions/award.js");

exports.get = function(data, done) {
    awardActions.checkDueBadges({ section: data.section, group: data.group }, function() {
        var where = 'WHERE awarded != 1 AND c.deleted != 1';
        var values = [];
        if (data.section) { where += ' AND c.section = ?'; values.push(data.section); }
        if (data.group) { where += ' AND c.`group` = ?'; values.push(data.group); }
        var query = "                                                                                       \
            SELECT                                                                                          \
                cb.id,                                                                                      \
                CONCAT(c.forename, ' ', c.surname) AS cub_name,                                             \
                IF(b.type='Staged', CONCAT(b.name, ' - stage ', b.stage), b.name) AS badge_name,            \
                b.image,                                                                                    \
                b.type,                                                                                     \
                cb.awarded                                                                                  \
            FROM cub_badges cb                                                                              \
            LEFT JOIN cubs c ON c.id = cb.cub_id                                                            \
            LEFT JOIN badges b ON b.id = cb.badge_id                                                        \
            " + where;
        db.get().query(query, values, function (err, rows) {
            if (err) return done(err)
            done(null, rows)
        })
    });
}
