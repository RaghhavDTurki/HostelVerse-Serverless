import { Attendence } from "../../models/Attendence.model";
import { Student } from "../../models/Student.model";
import { CreateStudentInput } from "../../types/ValidationInput";
import { createOTP } from "../../utils/createOTP";
import { sendOTPEmail } from "../../utils/mailer";
import * as Sentry from "@sentry/node";
import { getDistance } from "../../utils/getDistance";

export const signupStudent = async (body: CreateStudentInput) => {
    try {

        // Check if user already exists with the given email
        if (await Student.findOne({ studentid: body.studentid }).lean()) {
            return {
                error: true,
                message: "Student with that student id already exists!"
            };
        }
        if (await Student.findOne({ email: body.email }).lean()) {
            return {
                error: true,
                message: "Student with that email already exists!"
            };
        }

        const OTP = createOTP();
        const expiry = Date.now() + 60 * 1000 * 15;  //Set expiry 15 mins ahead from now

        const distance = await getDistance(body.location);

        const student = new Student();
        student.email = body.email;
        student.password = body.password;
        student.studentid = body.studentid;
        student.batch = body.studentid.substring(0, 4);
        student.profile.name = body.name;
        student.profile.gender = body.gender;
        student.profile.email = body.email;
        student.profile.contactno = body.contactno;
        student.profile.location = body.location;
        student.profile.studentid = body.studentid;
        student.profile.role = "student";
        student.emailToken = OTP;
        student.emailTokenExpires = new Date(expiry);
        student.distance = distance;
        student.save();

        const studentEntry = new Attendence({
            studentid: body.studentid
        });
        await studentEntry.save();

        const sendOTP = await sendOTPEmail(body.email, OTP);
        if (sendOTP.error) {
            return {
                error: true,
                message: "Couldn't send verification email."
            };
        }
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        };
    }

};