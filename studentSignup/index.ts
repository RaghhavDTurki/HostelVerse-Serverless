import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import * as Sentry from "@sentry/node";
import { CreateStudentInput } from "../src/types/ValidationInput"; 
import { signupStudent } from "../src/controller/Student/StudentSignup";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = {'Content-Type': 'application/json'};

     if(!req.body)
     {
        console.log(req.body);
        context.res = {
            Headers: HEADERS,
            status: 400,
            body: {
                message: "The body cannot be empty!"
            }
        };
        return;
    }

    sentryInit();
    connect();
    try{
        const body: CreateStudentInput = req.body;
        const result = await signupStudent(body);
        if(result){
            context.res = {
                Headers: HEADERS,
                status: 500,
                body: {
                    message: result.message
                }
            };
        }
        else{
            context.res = {
                Headers: HEADERS,
                status: 200,
                body: {
                    message: "Student created successfully!",
                }
            };
        }
    }
    catch(err){
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            status: 500,
            body: {
                message: err
            },
            headers: HEADERS
        };
    }
};

export default httpTrigger;