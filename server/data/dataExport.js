var db = require('../../db.js')
var server = require('../server.js')
var promise = require("es6-promise");
var Promise = promise.Promise;
var csv = require('csv');
var moment = require('moment');

exports.get = function(data, done) {
    var where = 'WHERE deleted != 1 AND date_of_birth IS NOT NULL';
    var values = [];
    if (data.id) { where += ' and id = ?'; values.push(data.id); }
    if (data.section) { where += ' and section = ?'; values.push(data.section); }
    if (data.group) { where += ' and `group` = ?'; values.push(data.group); }
    var query = '                               \
        SELECT id, CONCAT(forename, " ", surname) as name, date_of_birth, invested, phone, address_1, address_2, address_3, town, postcode \
        FROM cubs                               \
        '+where+'                               \
        ORDER BY date_of_birth                  \
    ';
    db.get().query(query, values, function (err, cubs) {
        var obj = csv();
        var exportData = [];

        return new Promise(function (resolve, reject) {
            cubs.map(function(cub, i) {
                var address = cub.address_1 + ', ' + cub.address_2 + (cub.address_3 ? (', ' + cub.address_3) : '') + ', ' + cub.town + ', ' + cub.postcode;
                var exportCub = [
                    cub.name,
                    moment(cub.date_of_birth).format('DD-MM-YYYY'),
                    moment(cub.invested).format('DD-MM-YYYY'),
                    cub.phone,
                    address
                ];

                return new Promise(function (resolve2, reject2) {
                    query = '                               \
                        SELECT CONCAT(p.forename, " ", p.surname) as name, p.phone_2, p.email                \
                        FROM parents p                               \
                        LEFT JOIN cub_parents cp ON p.id = cp.parent_id \
                        WHERE p.deleted != 1                      \
                        AND cp.cub_id = '+cub.id+'                   \
                        LIMIT 2             \
                    ';
                    db.get().query(query, function (err, parents) {
                        if (parents) {
                            parents.map(function(parent, i2) {
                                exportCub.push(parent.name);
                                exportCub.push(parent.phone_2);
                                exportCub.push(parent.email);
                                if (i2+1 == parents.length) resolve2(exportCub);
                            })
                        } else {
                            resolve2(exportCub);
                        }
                    })
                }).then(function(cub) {

                    exportData.push(cub);

                    if (i+1 == cubs.length) {
                        resolve(exportData);
                    }
                })
            })
        }).then(function(exportData) {
            function compare(a, b) {
                // Sort by date of birth
                a = moment(a[1], 'DD/MM/YYYY').format('YYYY-MM-DD');
                b = moment(b[1], 'DD/MM/YYYY').format('YYYY-MM-DD');
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            }
            exportData.sort(compare);
            exportData.unshift([
                'Cub name',
                'Date of birth',
                'Invested',
                'Home phone',
                'Address',
                'Parent 1 name',
                'Mobile number',
                'Email',
                'Parent 2 name',
                'Mobile number',
                'Email'
            ]);

            var date = moment().format('YYYY-MM-DD');
            var filename = './exports/'+date+'-cub-export.csv';
            obj.from.array(exportData).to.path(filename);
            done();
        })
    })
}
