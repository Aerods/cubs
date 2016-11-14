var db = require('../../db.js')
var server = require('../server.js')

exports.get = function(data, done) {
    var where = 'WHERE deleted = 0';
    if (data.id) { where += (' and id =' + data.id); }
    var orderBy = ' ORDER BY dob';
    if (data.orderBy == 'name') orderBy = ' ORDER BY forename, surname';

    var query = '                   \
        SELECT                      \
            id,                     \
            forename,               \
            surname,                \
            DATE_FORMAT(date_of_birth, "%Y%m%d") as dob,    \
            DATE_FORMAT(date_of_birth, "%d/%m/%Y") as date_of_birth,    \
            ROUND(DATEDIFF(CURDATE(), date_of_birth) / 365.25, 1) as age,    \
            gender,                 \
            rank,                   \
            six,                    \
            phone,                  \
            address_1,              \
            address_2,              \
            address_3,              \
            town,                   \
            postcode,               \
            DATE_FORMAT(start_date, "%d/%m/%Y") as start_date,          \
            DATE_FORMAT(from_beavers, "%d/%m/%Y") as from_beavers,          \
            DATE_FORMAT(invested, "%d/%m/%Y") as invested,               \
            previous_group,    \
            medical_information,    \
            notes,    \
            DATE_FORMAT(to_scouts, "%d/%m/%Y") as to_scouts               \
        FROM cubs                   \
    ' + where + orderBy;
    db.get().query(query, function (err, rows) {
        if (err) return done(err)
        done(null, rows)
    })
}
