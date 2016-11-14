var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var query = '                                       \
        SELECT "All" AS group_name,                     \
            COUNT(*) as count,                          \
            ROUND(AVG(DATEDIFF(CURDATE(), date_of_birth) / 365.25), 1) AS age,              \
	        ROUND(AVG(bc.badges), 0) AS badges          \
        FROM cubs c                                     \
        LEFT JOIN (SELECT cub_id, COUNT(*) AS badges FROM cub_badges GROUP BY cub_id) bc    \
            ON c.id=bc.cub_id                           \
        WHERE deleted = 0                               \
        UNION                                           \
        SELECT gender AS group_name,                    \
            COUNT(*) as count,                          \
            ROUND(AVG(DATEDIFF(CURDATE(), date_of_birth) / 365.25), 1) AS age,              \
	        ROUND(AVG(bc.badges), 0) AS badges          \
        FROM cubs c                                     \
        LEFT JOIN (SELECT cub_id, COUNT(*) AS badges FROM cub_badges GROUP BY cub_id) bc    \
            ON c.id=bc.cub_id                           \
        WHERE deleted = 0                               \
        GROUP BY gender                                 \
        UNION                                           \
        SELECT six AS group_name,                       \
            COUNT(*) as count,                          \
            ROUND(AVG(DATEDIFF(CURDATE(), date_of_birth) / 365.25), 1) AS age,              \
	        ROUND(AVG(bc.badges), 0) AS badges          \
        FROM cubs c                                     \
        LEFT JOIN (SELECT cub_id, COUNT(*) AS badges FROM cub_badges GROUP BY cub_id) bc    \
            ON c.id=bc.cub_id                           \
        WHERE deleted = 0                               \
        GROUP BY six                                    \
        UNION                                           \
        SELECT "Tedburn" AS group_name,                 \
            COUNT(*) as count,                          \
            ROUND(AVG(DATEDIFF(CURDATE(), date_of_birth) / 365.25), 1) AS age,              \
	        ROUND(AVG(bc.badges), 0) AS badges          \
        FROM cubs c                                     \
        LEFT JOIN (SELECT cub_id, COUNT(*) AS badges FROM cub_badges GROUP BY cub_id) bc    \
            ON c.id=bc.cub_id                           \
        WHERE deleted = 0                               \
        AND (address_2 LIKE "%tedburn%" OR address_3 LIKE "%tedburn%")                      \
        UNION                                           \
        SELECT "Cheriton" AS group_name,                \
            COUNT(*) as count,                          \
            ROUND(AVG(DATEDIFF(CURDATE(), date_of_birth) / 365.25), 1) AS age,              \
	        ROUND(AVG(bc.badges), 0) AS badges          \
        FROM cubs c                                     \
        LEFT JOIN (SELECT cub_id, COUNT(*) AS badges FROM cub_badges GROUP BY cub_id) bc    \
            ON c.id=bc.cub_id                           \
        WHERE deleted = 0                               \
        AND (address_2 LIKE "%cheriton%" OR address_3 LIKE "%cheriton%")                    \
    ';
    db.get().query(query, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
