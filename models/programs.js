const mongoose = require('mongoose');
const schema = mongoose.Schema;

const programSchema = new schema({
    name: String,
    active_flag: Boolean,
    task_list: [
        {
            title: String,
            description: String,
            deadline: { type: Date },
            file_type: String,
        },
    ],
});

module.exports = mongoose.model('programs', programSchema);
