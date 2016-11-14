var db = require('../../db.js')
var server = require('../server.js')

exports.save = function(data, cub_id, done) {
    var promise = require("es6-promise");
    var Promise = promise.Promise;
    return new Promise(function (resolve, reject) {
        data.map(function(cub_badge, key) {
            if (!cub_badge.id) {
                var values = [
                    cub_id,
                    cub_badge.badge_id,
                    (cub_badge.awarded || 0)
                ];
                db.get().query('                    \
                    INSERT INTO cub_badges (        \
                        cub_id,                     \
                        badge_id,                   \
                        awarded)                    \
                    VALUES(?, ?, ?)                 \
                ', values, function(err, result) {
                    if (err) return done(err);
                })
            } else if (!cub_badge.deleted) {
                var values = [
                    cub_id,
                    cub_badge.badge_id,
                    (cub_badge.awarded || 0),
                    cub_badge.id
                ];
                db.get().query('UPDATE cub_badges SET cub_id = ?, badge_id = ?, awarded = ? WHERE id = ?', values, function(err, result) {
                    if (err) return done(err);
                })
            } else {
                deleteTask(cub_badge.id, function(id) { done(null, id); });
            }
        })
        resolve();
    }).then(function() {
        done(null);
    })
}

function deleteCubBadge(id, done) {
    db.get().query('DELETE FROM cub_badges WHERE id = ?', id, function(err, result) {
        if (err) return done(err);
        done(null, id);
    })
}
