var router = require("express").Router();
router.route("/database/:id?").post(post).put(put);
var leaderData = require("./data/leader");

function post(req, res) {
    if (req.body.token != 'P3X-595') {
        console.log('Permission error!');
        res.send('Permission error!');
    } else {
        leaderData.get({ id: req.body.leader_id }, function (err, data) {
            req.body.group = data[0].group;
            req.body.section = data[0].section;
            var actions = require("./actions/"+req.body.dataType);
            actions.create(req.body, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    res.json(data);
                }
            });
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
        leaderData.get({ id: req.body.leader_id }, function (err, data) {
            req.body.group = data[0].group;
            req.body.section = data[0].section;
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
        leaderData.get({ id: req.body.leader_id }, function (err, data) {
            req.body.group = data[0].group;
            req.body.section = data[0].section;
            var actions = require("./actions/"+req.body.dataType);
            actions[req.body.actionType](req.body, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    res.json(data);
                }
            });
        });
    } else {
        res.json();
    }
}

module.exports = router;
