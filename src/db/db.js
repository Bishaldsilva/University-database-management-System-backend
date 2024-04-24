import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`);
        console.log("Database connected. Host is ", conn.connection.host);
    } catch (error) {
        console.log("An error ocured: ", error);
    }
}

export default connectDb;