import mongoose from 'mongoose';

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connect database to ${conn.connection.host}`);
    }catch(error){
        console.log("Error connecting to the Database");
    }
}

export {connectDB};