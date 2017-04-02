var db = require('../../db.js')
var server = require('../server.js')
var cubActions = require("./cub.js");
var parentActions = require("./parent.js");
var cubBadgeActions = require("./cubBadge.js");
var action_log = require("./action_log.js");
var promise = require("es6-promise");
var Promise = promise.Promise;
var moment = require('moment');

exports.create = function(data, done) {
    var date_of_birth = moment(data.date_of_birth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var start_date = moment(data.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var from_beavers = moment(data.from_beavers, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var invested = moment(data.invested, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var to_scouts = moment(data.to_scouts, 'DD/MM/YYYY').format('YYYY-MM-DD');
    var values = [
        data.forename,
        data.surname,
        (date_of_birth == 'Invalid date' ? null : date_of_birth),
        data.gender,
        (data.rank == 'None' ? null : data.rank),
        data.six,
        data.phone,
        data.address_1,
        data.address_2,
        data.address_3,
        data.town,
        data.postcode,
        (start_date == 'Invalid date' ? null : start_date),
        (from_beavers == 'Invalid date' ? null : from_beavers),
        (invested == 'Invalid date' ? null : invested),
        data.previous_group,
        data.medical_information,
        data.notes,
        (to_scouts == 'Invalid date' ? null : to_scouts),
        data.section,
        data.group
    ];
    action_log.create('cubs', 'insert', data, function() {
        db.get().query('                                        \
            INSERT INTO cubs (                                  \
                forename,                                       \
                surname,                                        \
                date_of_birth,                                  \
                gender,                                         \
                rank,                                           \
                six,                                            \
                phone,                                          \
                address_1,                                      \
                address_2,                                      \
                address_3,                                      \
                town,                                           \
                postcode,                                       \
                start_date,                                     \
                from_beavers,                                   \
                invested,                                       \
                previous_group,                                 \
                medical_information,                            \
                notes,                                          \
                to_scouts,                                      \
                section,                                        \
                `group`,                                        \
                waiting                                         \
            )                                                   \
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)    \
        ', values, function(err, result) {
            if (err) return done(err)
            server.emitSocket('cubsUpdate');
            data.parents = [{
                title: data.p1_title,
                forename: data.p1_forename,
                surname: data.p1_surname,
                surname: data.p1_surname,
                relationship: data.p1_relationship,
                phone_1: (data.p1_lives_with_cub ? data.phone_1 : data.p1_phone_1),
                phone_2: data.p1_phone_2,
                email: data.p1_email,
                address_1: (data.p1_lives_with_cub ? data.address_1 : data.p1_address_1),
                address_2: (data.p1_lives_with_cub ? data.address_2 : data.p1_address_2),
                address_3: (data.p1_lives_with_cub ? data.address_3 : data.p1_address_3),
                town: (data.p1_lives_with_cub ? data.town : data.p1_town),
                postcode: (data.p1_lives_with_cub ? data.postcode : data.p1_postcode)
            }];
            if (data.p2_forename) {
                data.parents.push({
                    title: data.p2_title,
                    forename: data.p2_forename,
                    surname: data.p2_surname,
                    surname: data.p2_surname,
                    relationship: data.p2_relationship,
                    phone_1: (data.p2_lives_with_cub ? data.phone_1 : data.p2_phone_1),
                    phone_2: data.p2_phone_2,
                    email: data.p2_email,
                    address_1: (data.p2_lives_with_cub ? data.address_1 : data.p2_address_1),
                    address_2: (data.p2_lives_with_cub ? data.address_2 : data.p2_address_2),
                    address_3: (data.p2_lives_with_cub ? data.address_3 : data.p2_address_3),
                    town: (data.p2_lives_with_cub ? data.town : data.p2_town),
                    postcode: (data.p2_lives_with_cub ? data.postcode : data.p2_postcode)
                });
            }
            cubActions.saveParents(data.parents, data.group, result.insertId, function(err) {
                if (err) return done(err);
                done(null, { id: result.insertId });
            })
        })
    })
}
