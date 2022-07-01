import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connect } from "../src/config/db.config";
import { sentryInit } from "../src/config/sentry.config";
import * as Sentry from "@sentry/node";
import { valdiateForgotPasswordToken } from "../src/controller/ForgotPassword/validateForgotPasswordToken";
import { changePassword } from "../src/controller/ForgotPassword/changePassword";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = { "Content-Type": "application/json" };
    sentryInit();
    connect();
    try {
        const token = req.query.token;
        const newPassword = req.query.newPassword;
        const oldPassword = req.query.oldPassword;
        const { error, message, data } = await valdiateForgotPasswordToken(token);
        if (error) {
            context.res = {
                status: 400,
                body: {
                    message: message
                },
                headers: HEADERS
            };
            return;
        }
        const { error: error2, message: message2, data: newUser } = await changePassword(newPassword, oldPassword, data);
        if (error2) {
            context.res = {
                status: 400,
                body: {
                    message: message2
                },
                headers: HEADERS
            };
            return;
        }
        context.res = {
            status: 200,
            body: {
                message: message2,
                data: newUser
            },
            headers: HEADERS
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            status: 500,
            body: {
                message: JSON.stringify({
                    error: err.message
                })
            },
            headers: HEADERS
        };
    }

};

export default httpTrigger;