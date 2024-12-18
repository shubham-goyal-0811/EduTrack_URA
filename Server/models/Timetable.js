import mongoose, { Schema } from 'mongoose';
//create a dateTime interface which contains the  fields date and time in which date is of type 30-11-2024 and time and 9:00 am

const taskSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    }
}, { _id: false });

const timetableSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        required: true,
    },
    tasks: [taskSchema]
});

export const Timetable = mongoose.model("Timetable", timetableSchema);

taskSchema.pre('save', function (next) {
    if (this.endTime <= this.startTime) {
        return next(new Error('End time must be after start time.'));
    }
    next();
});
