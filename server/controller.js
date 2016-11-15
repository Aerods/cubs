var router = require("express").Router();
router.route("/database/:id?").post(post).put(put);

function post(req, res) {
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

function put(req, res) {
    if (req.body.actionType == 'get') {
        var data = require("./data/"+req.body.dataType);
        data[req.body.actionType](req.body, function (err, data) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.json(data);
            }
        });
    } else if (req.body.actionType) {
        var actions = require("./actions/"+req.body.dataType);
        actions[req.body.actionType](req.body, function (err, data) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.json(data);
            }
        });
    } else {
        res.json();
    }
}

module.exports = router;
