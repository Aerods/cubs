var router = require("express").Router();
router.route("/database/:id?").post(post).put(put);
var leaderData = require("./data/leader");
var parentData = require("./data/parent");

function post(req, res) {
    if (req.body.dataType == 'application') {
        var application = require("./actions/application");
        application.create(req.body, function (err, data) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.json(data);
            }
        });
    } else if (req.body.token != 'P3X-595') {
        console.log('Permission error!');
        res.send('Permission error!');
    } else {
        getUserData(req, function(req) {
            if (!req.body.admin) {
                console.log('Permission error!');
                res.send('Permission error!');
            } else {
                var actions = require("./actions/"+req.body.dataType);
                actions.create(req.body, function (err, data) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        res.json(data);
                    }
                });
            }
        });
    }
}

function put(req, res) {
    if (req.body.dataType == 'login') {
        var leader = require("./actions/leader");
        leader.login(req.body, function (err, data) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.json(data);
            }
        });
    } else if (req.body.token != 'P3X-595') {
        console.log('Permission error!');
        res.send('Permission error!');
    } else if (req.body.actionType == 'get') {
        getUserData(req, function(req2) {
            var data = require("./data/"+req.body.dataType);
            data[req.body.actionType](req.body, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    res.json(data);
                }
            });
        });
    } else if (req.body.actionType) {
        getUserData(req, function(req) {
            if (!req.body.admin && (req.body.dataType != 'leader' || req.body.id != req.body.leader_id)) {
                console.log('Permission error!');
                res.send('Permission error!');
            } else {
                var actions = require("./actions/"+req.body.dataType);
                actions[req.body.actionType](req.body, function (err, data) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        res.json(data);
                    }
                });
            }
        });
    } else {
        res.json();
    }
}

function getUserData(req, done) {
    if (req.body.leader_id) {
        leaderData.get({ id: req.body.leader_id }, function (err, data) {
            if (data[0]) {
                req.body.group = data[0].group;
                req.body.section = data[0].section;
                req.body.admin = data[0].admin;
                done(req);
            }
        });
    }
    // if (req.body.parent_id) {
    //     parentData.getUser({ parent_id: req.body.parent_id }, function (err, data) {
    //         if (data[0]) {
    //             req.body.cub_ids = data[0].cub_ids;
    //             req.body.sections = data[0].sections;
    //             done(req);
    //         }
    //     });
    // }
}

module.exports = router;
