var db = require('../../db.js')
var server = require('../server.js')
var moment = require('moment');
var promise = require("es6-promise");
var Promise = promise.Promise;

function completeTask(cub_id, task_id) {
    db.get().query('                    \
        INSERT INTO cub_badge_tasks (   \
            cub_id,                     \
            badge_task_id)              \
        VALUES(?, ?)                    \
    ', [cub_id, task_id]);
}

function checkBadgeEarned(cub, badge, done) {
    var allCriteriaCompleted = 1;
    return new Promise(function (resolve, reject) {

        var criteriaChecked = 0;
        badge.criteria.map(function(criteria) {
            checkCriteriaMet(cub, criteria, function(met) {
                if (!met) allCriteriaCompleted = 0;
                criteriaChecked ++;
                if (criteriaChecked == badge.criteria.length) resolve();
            })
        })
    }).then(function() {
        if (allCriteriaCompleted) {
            if (badge.name == 'Our Adventure') completeTask(cub.id, 131);
            if (badge.name == 'Our Outdoors') completeTask(cub.id, 135);
            if (badge.name == 'Our Skills') completeTask(cub.id, 130);
            if (badge.name == 'Our World') completeTask(cub.id, 129);
            if (badge.name == 'Teamwork') completeTask(cub.id, 132);
            if (badge.name == 'Team Leader') completeTask(cub.id, 133);
            if (badge.name == 'Personal Challenge') completeTask(cub.id, 134);
            db.get().query('                        \
                INSERT INTO cub_badges (            \
                    cub_id,                         \
                    badge_id                        \
                )                                   \
                VALUES(?, ?)                        \
            ', [cub.id, badge.id], function(err, result) {
                done();
            });
        } else {
            done();
        }
    })
}

function checkCriteriaMet(cub, criteria, done) {
    var allTasksCompleted = 1;
    var xTasksCompleted = 0;
    return new Promise(function (resolve, reject) {
        var tasksChecked = 0;
        criteria.tasks.map(function(task) {
            if (task.task == 'Participate in scouting for 1 year' && moment().diff(cub.invested, 'years') >= 1) { resolve(); completeTask(cub.id, 169); }
            if (task.task == 'Participate in scouting for 2 years' && moment().diff(cub.invested, 'years') >= 2) { resolve(); completeTask(cub.id, 170); }
            if (task.task == 'Participate in scouting for 3 years' && moment().diff(cub.invested, 'years') >= 3) { resolve(); completeTask(cub.id, 171); }
            if (task.task == 'Participate in scouting for 4 years' && moment().diff(cub.invested, 'years') >= 4) { resolve(); completeTask(cub.id, 174); }
            if (task.task == 'Move up from Beavers' && cub.from_beavers) { resolve(); completeTask(cub.id, 177); }
            if (task.task == 'Be invested into the Scout Association.' && cub.invested) { resolve(); completeTask(cub.id, 354); }
            db.get().query('SELECT count(*) as completed FROM cub_badge_tasks WHERE cub_id = ? AND badge_task_id = ?', [cub.id, task.id], function(err, rows) {
                if (rows[0].completed) xTasksCompleted ++;
                else allTasksCompleted = 0;
                tasksChecked ++;
                if (tasksChecked == criteria.tasks.length) resolve();
            });
        })
    }).then(function() {
        if (allTasksCompleted || (xTasksCompleted >= criteria.complete_x && criteria.complete_x)) {
            db.get().query('                        \
                INSERT INTO cub_badge_criteria (    \
                    cub_id,                         \
                    badge_criteria_id               \
                )                                   \
                VALUES(?, ?)                        \
            ', [cub.id, criteria.id], function(err, result) {
                done(1);
            });
        } else {
            done(0);
        }
    })
}

exports.checkDueBadges = function(data, done) {
    return new Promise(function (resolve, reject) {
        db.get().query('SELECT * from cubs WHERE deleted != 1 AND section = ? AND `group` = ?', [data.section, data.group], function(err, cubs) {
            resolve(cubs);
        });
    }).then(function(cubs) {
        return new Promise(function (resolve, reject) {
            db.get().query('SELECT * from badges where deleted != 1 and (section = ? or section is null)', [data.section], function(err, badges) {
                var badgesLooped = 0;
                var badgesWithCriteria = [];
                badges.map(function(badge) {

                    return new Promise(function (resolve2, reject2) {

                        db.get().query('SELECT * from badge_criteria where badge_id = ?', [badge.id], function(err, badge_criteria) {
                            var criteriaLooped = 0;
                            var criteriaWithTasks = [];
                            badge_criteria.map(function(criteria) {

                                db.get().query('SELECT * from badge_tasks where badge_criteria_id = ?', [criteria.id], function(err, tasks) {
                                    criteria.tasks = tasks;
                                    criteriaWithTasks.push(criteria);
                                    criteriaLooped ++;
                                    if (criteriaLooped == badge_criteria.length) resolve2(criteriaWithTasks);
                                })
                            })
                        })

                    }).then(function(criteriaWithTasks) {
                        badge.criteria = criteriaWithTasks;
                        badgesWithCriteria.push(badge);
                        badgesLooped ++;
                        if (badgesLooped == badges.length) resolve(badgesWithCriteria);
                    })

                })
            });

        }).then(function(badges) {

            var cubsChecked = 0;
            cubs.map(function(cub) {
                return new Promise(function (resolve, reject) {

                    var badgesChecked = 0;
                    badges.map(function(badge) {
                        badgesChecked ++;
                        checkBadgeEarned(cub, badge, function() {
                            if (badgesChecked == badges.length) resolve();
                        })
                    })
                }).then(function() {
                    cubsChecked++;
                    if (cubsChecked == cubs.length) done();
                })
            })
        })
    })
}

exports.update = function(data, done) {
    var values = [
        data.awarded,
        data.id
    ];
    db.get().query('UPDATE cub_badges SET awarded = ? WHERE id = ?', values, function(err, result) {
        if (err) return done(err)
        done(null, { id: data.id })
    })
}
