import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { sentryInit } from "../src/config/sentry.config";
import { connect } from "../src/config/db.config";
import { verifyToken } from "../src/utils/verifyToken";
import { CreateSemesterScheduleInput } from "../src/types/ValidationInput";
import * as Sentry from "@sentry/node";
import { createSemesterSchedule } from "../src/controller/Admin/createSemesterSchedule";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = { "Content-Type": "application/json" };
    sentryInit();
    connect();
    try {
        // Check for Token in Headers
        const authToken = req.headers.authorization;
        if (!authToken) {
            context.res = {
                status: 401,
                body: {
                    message: "No authorization token provided!"
                },
                headers: HEADERS
            };
            return;
        }
        const unsealedToken = await verifyToken(authToken, "admin");
        if (unsealedToken.error) {
            context.res = {
                status: 401,
                body: {
                    message: "Unauthorized!"
                },
                headers: HEADERS
            };
            return;
        }
        const body = req.body as CreateSemesterScheduleInput;
        const result = await createSemesterSchedule(body);
        if (result.error) {
            context.res = {
                status: 400,
                body: {
                    message: result.message
                },
                headers: HEADERS
            };
        }
        else {
            context.res = {
                status: 200,
                body: {
                    message: "Semester schedule created successfully!"
                },
                headers: HEADERS
            };
        }
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            status: 500,
            body: {
                error: true,
                message: err.message
            },
            headers: HEADERS
        };
    }
};

export default httpTrigger;