var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 'WHERE deleted = 0';
    var values = [];
    if (data.section) { where += ' and section = ?'; values.push(data.section); }
    if (data.group) { where += ' and `group` = ?'; values.push(data.group); }
    if (data.section) { values.push(data.section); }
    if (data.group) { values.push(data.group); }
    if (data.section) { values.push(data.section); }
    if (data.group) { values.push(data.group); }
    if (data.section) { values.push(data.section); }
    if (data.group) { values.push(data.group); }
    if (data.section) { values.push(data.section); }
    if (data.group) { values.push(data.group); }

    var query = '                                       \
        SELECT "All" AS group_name,                     \
            COUNT(*) as count,                          \
            ROUND(AVG(DATEDIFF(CURDATE(), date_of_birth) / 365.25), 1) AS age,              \
	        ROUND(AVG(bc.badges), 0) AS badges          \
        FROM cubs c                                     \
        LEFT JOIN (SELECT cub_id, COUNT(*) AS badges FROM cub_badges GROUP BY cub_id) bc    \
            ON c.id=bc.cub_id                           \
        '+where+'                                       \
        UNION                                           \
        SELECT gender AS group_name,                    \
            COUNT(*) as count,                          \
            ROUND(AVG(DATEDIFF(CURDATE(), date_of_birth) / 365.25), 1) AS age,              \
	        ROUND(AVG(bc.badges), 0) AS badges          \
        FROM cubs c                                     \
        LEFT JOIN (SELECT cub_id, COUNT(*) AS badges FROM cub_badges GROUP BY cub_id) bc    \
            ON c.id=bc.cub_id                           \
        '+where+'                                       \
        GROUP BY gender                                 \
        UNION                                           \
        SELECT six AS group_name,                       \
            COUNT(*) as count,                          \
            ROUND(AVG(DATEDIFF(CURDATE(), date_of_birth) / 365.25), 1) AS age,              \
	        ROUND(AVG(bc.badges), 0) AS badges          \
        FROM cubs c                                     \
        LEFT JOIN (SELECT cub_id, COUNT(*) AS badges FROM cub_badges GROUP BY cub_id) bc    \
            ON c.id=bc.cub_id                           \
        '+where+'                                       \
        GROUP BY six                                    \
        UNION                                           \
        SELECT "Tedburn" AS group_name,                 \
            COUNT(*) as count,                          \
            ROUND(AVG(DATEDIFF(CURDATE(), date_of_birth) / 365.25), 1) AS age,              \
	        ROUND(AVG(bc.badges), 0) AS badges          \
        FROM cubs c                                     \
        LEFT JOIN (SELECT cub_id, COUNT(*) AS badges FROM cub_badges GROUP BY cub_id) bc    \
            ON c.id=bc.cub_id                           \
        '+where+'                                       \
        AND (address_2 LIKE "%tedburn%" OR address_3 LIKE "%tedburn%")                      \
        UNION                                           \
        SELECT "Cheriton" AS group_name,                \
            COUNT(*) as count,                          \
            ROUND(AVG(DATEDIFF(CURDATE(), date_of_birth) / 365.25), 1) AS age,              \
	        ROUND(AVG(bc.badges), 0) AS badges          \
        FROM cubs c                                     \
        LEFT JOIN (SELECT cub_id, COUNT(*) AS badges FROM cub_badges GROUP BY cub_id) bc    \
            ON c.id=bc.cub_id                           \
        '+where+'                                       \
        AND (address_2 LIKE "%cheriton%" OR address_3 LIKE "%cheriton%")                    \
    ';
    db.get().query(query, values, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
