import axios from "axios";
import { Attendence } from "../../models/Attendence.model";
import { Student } from "../../models/Student.model";
import { StudentInput } from "../../types/ValidationInput";
import { createOTP } from "../../utils/createOTP";
import { sendOTPEmail } from "../../utils/mailer";
import * as Sentry from '@sentry/node';

const MAP_QUEST_KEY = process.env.MAP_QUEST_KEY
const college_location = "26.9124, 75.7873";
async function getDistance(location: string): Promise<number> {
    // const query_url = `http://www.mapquestapi.com/directions/v2/route?key=${MAP_QUEST_KEY}&unit=k&from=${location}&to=${college_location}`;
    const query_url = `http://www.mapquestapi.com/directions/v2/route?key=${MAP_QUEST_KEY}&from=${location}&to=${college_location}`;
    // console.log(query_url);
    const distance = (await axios.get(query_url)).data;
    // console.log(distance);
    const answer = distance.route.distance;
    return answer;
}

export const signupStudent = async (body: StudentInput) => {
    try{

        // Check if user already exists with the given email
        if (await Student.findOne({ email: body.email }).lean()){
            return { 
                error: true, 
                message: "Student with that email already exists!" 
            };
        }
    
        const OTP = createOTP();
        const expiry = Date.now() + 60 * 1000 * 15;  //Set expiry 15 mins ahead from now
        const sendOTP = await sendOTPEmail(body.email, OTP);
        if(sendOTP.error){
            return { 
                error: true, 
                message: "Couldn't send verification email."
            };
        }
    
        const studentEntry = new Attendence({
            studentid: body.studentid
        });
        await studentEntry.save();
    
        const distance = await getDistance(body.location);
    
        const student = new Student();
        student.email = body.email;
        student.password = body.password;
        student.studentid = body.studentid;
        student.profile.name = body.name;
        student.profile.gender = body.gender;
        student.profile.email = body.email;
        student.profile.contactno = body.contactno;
        student.profile.location = body.location;
        student.emailToken = OTP;
        student.emailTokenExpires = new Date(expiry);
        student.distance = distance;
        student.save();
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        return {
            error: true,
            message: err
        };
    }

}