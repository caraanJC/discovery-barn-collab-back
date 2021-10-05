const mongoose = require('mongoose');
const schema = mongoose.Schema;

const studentSchema = new schema({
    first_name: String,
    last_name: String,
    age: Number,
    program_id: { type: mongoose.Schema.Types.ObjectId, ref: 'programs' },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'parents' },
    submissions: [
        {
            link: String,
            task_id: String,
            date_submitted: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model('students', studentSchema);
