import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as Sentry from "@sentry/node";
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import { getStudentProfile } from "../src/controller/Student/studentProfile";
import { verifyToken } from "../src/utils/verifyToken";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = { "Content-Type": "application/json" };
    connect();
    sentryInit();
    try{
        // Check for token
        const authToken = req.headers.authorization;
        if(!authToken){
            context.res = {
                status: 401,
                body: {
                    message: "No authorization token provided!"
                },
                headers: HEADERS
            };
            return;
        }
        const unsealedToken = await verifyToken(authToken, "student");
        if(unsealedToken.error){
            context.res = {
                status: 401,
                body: {
                    message: "Unauthorized!"
                },
                headers: HEADERS
            };
            return;
        }
        const studentid = req.query.studentid;
        if(!studentid){
            context.res = {
                status: 400,
                body: {
                    error: true,
                    message: "Student id is required!"
                }
            };
            return;
        }
        const student = await getStudentProfile(studentid);
        if(student.error){
            context.res = {
                status: 400,
                body: student
            }
            return;
        }
        context.res = {
            status: 200,
            body: student.data
        };
    }
    catch(err)
    {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            status: 500,
            body: {
                error: true,
                message: err
            }
        }
    }
};

export default httpTrigger;