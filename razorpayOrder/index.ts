import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as Sentry from "@sentry/node";
import { sentryInit } from "../src/config/sentry.config";
import Razorpay from "razorpay";

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_TEST_KEY,
    key_secret: process.env.RAZORPAY_TEST_SECRET
});

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const HEADERS = { "Content-Type": "application/json" };
    sentryInit();
    try {
        const data = await instance.orders.create({
            amount: 50000,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                key1: "value3",
                key2: "value2"
            }
        });
        const datta = await instance.orders.all();
        context.res = {
            status: 200,
            body: {
                message: datta,
            },
            headers: HEADERS,
        };
    }
    catch (err) {
        Sentry.captureException(err);
        await Sentry.flush(2000);
        context.res = {
            HEADERS,
            body: {
                message: JSON.stringify({
                    error: err.message
                })
            },
            status: 500
        };
    }
};

export default httpTrigger;