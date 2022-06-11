import * as Sentry from "@sentry/node";

export const sentryInit = () => {
    if(!Sentry){
        console.log("Sentry issue!");
    }
    if(Sentry.getCurrentHub().getClient()){
        return;
    }

    Sentry.init({
        dsn: process.env.SENTRY_DSN
    });
    return;
};