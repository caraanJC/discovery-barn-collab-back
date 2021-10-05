const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const logs = require('../models/logs');
const videos = require('../models/videos');


const logActivity = (logs, logDetails) => {
	let newLog = new logs(logDetails);
	newLog.save().then((data) => {
		//console.log(logDetails);
	});
};

router.get('/', (req, res) => {
	videos
		.aggregate([
			{
				$lookup: {
					from: 'programs',
					localField: 'program_id',
					foreignField: '_id',
					as: 'programinfo',
				},
			},
		])
		.then((data) => {
			res.send(data);
		});
});

router.get('/info/:id', (req, res) => {
	videos.findById(req.params.id).then((data) => {
		res.send(data);
	});
});

router.get('/:id', (req, res) => {
	const today = new Date();
	today.toISOString().split('T')[0];
	videos.find({ program_id: req.params.id, lesson_date : { $lte : today }, active_flag:true }).then((data) => {
		res.send(data);
	});
});

//Create New Row
router.post('/', (req, res) => {
	let newVideo = new videos(req.body);
	newVideo.save().then((data) => {
		logActivity(logs, {
			module: 'VIDEO',
			details: 'Video Created',
			created_date: new Date(),
		});
		res.send({ success: true, message: 'Video created' });
	});
});

//Update Row
router.put('/:id', (req, res) => {
	videos
		.findByIdAndUpdate(req.params.id, {
			$set: {
				title: req.body.title,
				description: req.body.description,
				program_id: req.body.program_id,
				lesson_date: req.body.lesson_date,
				active_flag: req.body.active_flag,
			},
		})
		.then((data) => {
			res.send({ success: true, message: 'Details Updated' });
			logActivity(logs, {
				module: 'VIDEO',
				details: 'Video Info Updated',
				created_date: new Date(),
			});
		});
});

//Update Row
router.put('/upload-file/:id/:type', (req, res) => {
	let type = req.params.type;
	let updateVal;
	let uploadDescription;
	if(type=='IMG'){
		updateVal = {thumbnail_path:req.body.path};
		uploadDescription = "Uploaded Image";
	}
	else if(type=='VID'){
	    updateVal = {video_path:req.body.path};
		uploadDescription = "Uploaded Video";
	}

	if(updateVal!=null){
		videos
			.findByIdAndUpdate(req.params.id, {
				$set: updateVal
			})
			.then((data) => {
				res.send({ success: true, message: uploadDescription });
				logActivity(logs, {
					module: 'VIDEO',
					details: uploadDescription,
					created_date: new Date(),
				});
			});
	}
	else{
		res.send({ success: false, message: 'Invalid Upload Type' });
	}
});

//Delete Row
router.delete('/:id', (req, res) => {
	videos.deleteOne({ _id: req.params.id }).then((data) => {
		res.send(data);
		logActivity(logs, {
			module: 'Video',
			details: 'Video Deleted',
			created_date: new Date(),
		});
	});
});

module.exports = router;
