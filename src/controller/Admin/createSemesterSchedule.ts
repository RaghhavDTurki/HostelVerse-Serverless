import * as Sentry from '@sentry/node';
import { SemesterSchedule } from '../../models/SemesterSchedule.model';
import { CreateSemesterScheduleInput } from '../../types/ValidationInput';

export const createSemesterSchedule = async (body: CreateSemesterScheduleInput) => {
    try {
        if (!body) {
            return {
                error: true,
                message: "Body is required!"
            };
        }
        // check if semester schedule already exists
        const semesterSchedule = await SemesterSchedule.findOne({ type: body.type, year: body.year }).lean();
        if (semesterSchedule) {
            return {
                error: true,
                message: "Semester schedule already exists!",
                data: semesterSchedule
            };
        }
        const newSemesterSchedule = new SemesterSchedule(body);
        await newSemesterSchedule.save();
        return {
            error: false,
            message: "Semester schedule created successfully!"
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err.message
        };
    }
}