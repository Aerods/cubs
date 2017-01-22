var db = require('../../db.js')
var server = require('../server.js')

exports.save = function(data, done) {
    if (!data.id) {
        var values = [
            data.badge_criteria_id,
            data.task,
            data.ordering || 1
        ];
        db.get().query('                    \
            INSERT INTO badge_tasks (       \
                badge_criteria_id,          \
                task,                       \
                ordering)                   \
            VALUES(?, ?, ?)                 \
        ', values, function(err, result) {
            if (err) return done(err);
            done(null, { id: result.insertId });
        })
    } else if (!data.deleted) {
        var values = [
            data.task,
            data.ordering || 1,
            data.id
        ];
        db.get().query('UPDATE badge_tasks SET task = ?, ordering = ? WHERE id = ?', values, function(err, result) {
            if (err) return done(err);
            done(null, { id: data.id });
        })
    } else {
        deleteTask(data.id, function(id) { done(null, id); });
    }
}

function deleteTask(id, done) {
    db.get().query('DELETE FROM badge_tasks WHERE id = ?', id, function(err, result) {
        if (err) return done(err);
        done(null, id);
    })
}
