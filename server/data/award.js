var db = require('../../db.js')
var server = require('../server.js')
var awardActions = require("../actions/award.js");

exports.get = function(data, done) {
    var query = "                                                                                       \
        SELECT                                                                                          \
            cb.id,                                                                                      \
            CONCAT(c.forename, ' ', c.surname) as cub_name,                                             \
            IF(b.type='Staged', CONCAT(b.name, ' - stage ', b.stage), b.name) as badge_name,            \
            b.image,                                                                                    \
            b.type,                                                                                     \
            cb.awarded                                                                                  \
        FROM cub_badges cb                                                                              \
        LEFT JOIN cubs c ON c.id = cb.cub_id                                                            \
        LEFT JOIN badges b ON b.id = cb.badge_id                                                        \
        WHERE awarded != 1";
    db.get().query(query, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    });
}
