import Mongoose from "mongoose";

let database: Mongoose.Connection;

export const connect = () => {
    const url = process.env.COSMOSDB_URI;

    if (database) {
        return;
    }
    
    Mongoose.connect(url).then(
        () => {
            console.log("CosmosDB connected");
        }
    );
    
    database = Mongoose.connection;
    database.once("open", async () => {
        console.log("Connected to database");
    });
      
    database.on("error", () => {
        console.log("Error connecting to database");
    });

};

export const disconnect = () => {
    
    if (!database) {
      return;
    }
    
    Mongoose.disconnect();

    database.once("close", async () => {
        console.log("Diconnected  to database");
    });

};