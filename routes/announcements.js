const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const logs = require('../models/logs');
const announcements = require('../models/announcements');

const logActivity = (logs, logDetails) => {
    let newLog = new logs(logDetails);
    newLog.save().then((data) => {
        //console.log(logDetails);
    });
};

router.get('/', (req, res) => {
    announcements.find().then((data) => {
        res.send(data);
    });
});

//Create New Row
router.post('/', (req, res) => {
    announcements
        .count({ title: req.body.title, date:req.body.date })
        .then(async (data) => {
            if (data > 0) {
                res.send({ success: false, message: 'Already Added' });
            } else {
                let newDoc = new announcements(req.body);
                newDoc.save().then((data) => {
                    logActivity(logs, {
                        module: 'ANNOUNCEMENTS',
                        details: 'Announcement Created',
                        created_date: new Date(),
                    });
                    res.send({ success: true, message: 'Announcement Created' });
                });
            }
        });
});


//Update Row
router.put('/:id', (req, res) => {
    announcements
        .findByIdAndUpdate(req.params.id, {
            $set: req.body
        })
        .then((data) => {
            res.send({ success: true, message: 'Details Updated' });
            logActivity(logs, {
                module: 'ANNOUNCEMENTS',
                details: 'Announcement Info Updated',
                created_date: new Date(),
            });
        });   
});


//Delete Row
router.delete('/:id', (req, res) => {
    announcements.deleteOne({ _id: req.params.id }).then((data) => {
        res.send(data);
        logActivity(logs, {
            module: 'ANNOUNCEMENTS',
            details: 'Announcement Deleted',
            created_date: new Date(),
        });
    });
});

module.exports = router;
