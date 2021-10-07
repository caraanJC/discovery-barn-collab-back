const express = require('express');
const router = express.Router();
const logs = require('../models/logs');
const programs = require('../models/programs');

const logActivity = (logs, logDetails) => {
	let newLog = new logs(logDetails);
	newLog.save().then((data) => {
		//console.log(logDetails);
	});
};

router.get('/', (req, res) => {
	programs.find().then((data) => {
		res.send(data);
	});
});

router.get('/:id', (req, res) => {
	programs.findById(req.params.id).then((data) => {
		res.send(data);
	});
});

//Create New Row
router.post('/', (req, res) => {
	programs.count({ name: req.body.name }).then(async (data) => {
		if (data > 0) {
			res.send({ success: false, message: 'Program Name Exists' });
		} else {
			let newProgram = new programs(req.body);
			newProgram.save().then((data) => {
				logActivity(logs, {
					module: 'PROGRAM',
					details: 'Program Created',
					created_date: new Date()
				});
				res.send({ success: true, message: 'Program created' });
			});
		}
	});
});

//Update Row
router.put('/:id', (req, res) => {
	programs
		.find({
			name: req.body.name,
			_id: { $ne: req.params.id }
		})
		.then((data) => {
			if (data.length > 0) {
				res.send({
					success: false,
					message: 'Program Name Exists'
				});
			} else {
				programs
					.findByIdAndUpdate(req.params.id, {
						$set: {
							name: req.body.name,
							active_flag: req.body.active_flag
						}
					})
					.then((data) => {
						res.send({ success: true, message: 'Details Updated' });
						logActivity(logs, {
							module: 'PROGRAM',
							details: 'Program Info Updated',
							created_date: new Date()
						});
					});
			}
		});
});

//Delete Row
router.delete('/:id', (req, res) => {
	programs.deleteOne({ _id: req.params.id }).then((data) => {
		res.send(data);
		logActivity(logs, {
			module: 'PROGRAM',
			details: 'Program Deleted',
			created_date: new Date()
		});
	});
});

// GET Task
router.get('/:program_id/getTasks', (req, res) => {
	programs.findById(req.params.program_id).then((data) => res.send(data.task_list));
	//Get Program Tasks
});

router.get('/program-tasks/:program', (req, res) => {
	programs.findById(req.params.program).then((data) => {
		res.send(data.task_list);
	});
});

// add Task
router.post('/addTask', (req, res) => {
	programs
		.findOneAndUpdate(
			{ name: req.body.programName },
			{
				$addToSet: { task_list: req.body.task }
			}
		)
		.then((data) => {
			res.send({ success: true, message: 'Task Item Added' });
			logActivity(logs, {
				module: 'PROGRAM',
				details: 'Task Added',
				created_date: new Date()
			});
		});
});

router.put('/:task_id/editTask', (req, res) => {
	programs
		.updateOne(
			{ name: req.body.programName, 'task_list._id': req.params.task_id },
			{
				$set: { 'task_list.$': req.body.task }
			}
		)
		.then((data) => {
			res.send({ success: true, message: 'Task Item Added' });
			logActivity(logs, {
				module: 'PROGRAM',
				details: 'Task Edited',
				created_date: new Date()
			});
		});
});

router.put('/:task_id/deleteTask', (req, res) => {
	programs.findOneAndUpdate({ name: req.body.name }, { $pull: { task_list: { _id: req.params.task_id } } }).then((data) => {
		res.send({ success: true, message: 'Task Item Deleted' });
		logActivity(logs, {
			module: 'PROGRAM',
			details: 'Task Deleted',
			created_date: new Date()
		});
	});
});

module.exports = router;
