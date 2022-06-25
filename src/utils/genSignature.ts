import { createHmac } from "crypto";
export function genSignature(order_id: string, razorpay_payment_id: string): string {
    const hmac = createHmac("sha256", process.env.RAZORPAY_TEST_SECRET).update(order_id + "|" + razorpay_payment_id).digest("hex");
    return hmac;
}