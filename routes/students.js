const express = require('express');
const router = express.Router();
const logs = require('../models/logs');
const students = require('../models/students');

const logActivity = (logs, logDetails) => {
	let newLog = new logs(logDetails);
	newLog.save().then((data) => {
		//console.log(logDetails);
	});
};

router.get('/', (req, res) => {
	students
		.aggregate([
			{
				$lookup: {
					from: 'parents',
					localField: 'parent_id',
					foreignField: '_id',
					as: 'parentinfo',
					pipeline: [
						{
							$project: {
								parent_name: {
									$concat: ['$first_name', ' ', '$last_name']
								}
							}
						}
					]
				}
			},
			{
				$lookup: {
					from: 'programs',
					localField: 'program_id',
					foreignField: '_id',
					as: 'programinfo'
				}
			}
		])
		.then((data) => {
			res.send(data);
		});
});

router.get('/program-students/:programId', (req, res) => {
	students.find({ program_id: req.params.programId }).then((data) => {
		res.send(data);
	});
});

router.post('/all-submissions', (req, res) => {
	let filters = {};
	if (req.body.program !== '' && req.body.program !== undefined) {
		filters.program_id = req.body.program;
	}
	if (req.body.student !== '' && req.body.student !== undefined) {
		filters._id = req.body.student;
	}
	students.find(filters).then((data) => {
		let test = [];
		data.map((student) => {
			student.submissions.map((s) => {
				let t;
				if (s.task_title === req.body.task || req.body.task === undefined || req.body.task === '') {
					t = {
						student_name: student.first_name + ' ' + student.last_name,
						file_path: s.file_path,
						file_name: s.file_name,
						reference: s.reference,
						task_title: s.task_title,
						date_submitted: s.date_submitted
					};
					test.push(t);
				}

				return;
			});

			return;
		});

		res.send(test);
	});
});

//Create New Row
router.post('/', (req, res) => {
	let newParent = new students(req.body);
	newParent.save().then((data) => {
		logActivity(logs, {
			module: 'PARENT',
			details: 'Parent Created',
			created_date: new Date()
		});
		res.send({ success: true, message: 'Parent created' });
	});
});

//Update Row
router.put('/:id', (req, res) => {
	students
		.findByIdAndUpdate(req.params.id, {
			$set: {
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				age: req.body.age,
				parent_id: req.body.parent_id,
				program_id: req.body.program_id
			}
		})
		.then((data) => {
			res.send({ success: true, message: 'Details Updated' });
			logActivity(logs, {
				module: 'STUDENT',
				details: 'Student Info Updated',
				created_date: new Date()
			});
		});
});

//Delete Row
router.delete('/:id', (req, res) => {
	students.deleteOne({ _id: req.params.id }).then((data) => {
		res.send(data);
		logActivity(logs, {
			module: 'STUDENT',
			details: 'Student Deleted',
			created_date: new Date()
		});
	});
});

// Check if file exists
router.post('/:student_id/submissions/file-exist', (req, res) => {
	students.findById(req.params.student_id).then((data) => {
		if (data.submissions.find((submission) => submission.task_id === req.body.task_id)) {
			res.send(true);
		} else {
			res.send(false);
		}
	});
});

// Add a Submission
router.post('/:student_id/submissions/upload', (req, res) => {
	students
		.findByIdAndUpdate(req.params.student_id, {
			$addToSet: { submissions: req.body }
		})
		.then((data) => res.send('Submission Successful'));
});

// Add a Submission
router.get('/:student_id/submissions/getSubmissions', (req, res) => {
	students.findById(req.params.student_id).then((data) => res.send(data.submissions));
});

// Delete a Submission
router.delete('/delete-submission/:studentID/:submissionID', (req, res) => {
	console.log(req.params.submissionID + '    --->   student: ' + req.params.studentID);
	students.findOneAndUpdate({ _id: req.params.studentID }, { $pull: { submissions: { _id: req.params.submissionID } } }).then((data) => {
		res.send({ success: true, message: 'File Item Deleted' });
		logActivity(logs, {
			module: 'ONLINE SUBMISSIONS',
			details: 'Submission Deleted: ' + req.params.submissionID,
			created_date: new Date()
		});
	});
});

module.exports = router;
