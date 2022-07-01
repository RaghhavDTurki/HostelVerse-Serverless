import * as Sentry from "@sentry/node";
import { genSignature } from "../../utils/genSignature";
import { Payment } from "../../models/Payment.model";
import { VerifyPaymentInput } from "../../types/ValidationInput";

export const verifyPayment = async (body: VerifyPaymentInput) => {
    try {
        if (!body) {
            return {
                error: true,
                message: "No body provided"
            };
        }

        const paymentDetail = await Payment.findOne({
            receiptid: body.receipt_id,
        });
        if (!paymentDetail) {
            return {
                error: true,
                message: "Payment not found"
            };
        }
        const orderid = paymentDetail.orderid;
        const signature = genSignature(orderid, body.razorpay_payment_id);
        if (signature !== body.razorpay_signature) {
            return {
                error: true,
                message: "Invalid signature"
            };
        }
        paymentDetail.razorpay_payment_id = body.razorpay_payment_id;
        paymentDetail.razorpay_order_id = body.razorpay_order_id;
        paymentDetail.razorpay_signature = body.razorpay_signature;
        paymentDetail.status = "Paid";
        await paymentDetail.save();
        return {
            error: false,
            message: "Payment verified successfully"
        };
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