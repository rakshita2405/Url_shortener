import mongoose from "mongoose";
import dns from "dns";


const url = 'mongodb+srv://akshimital549:akshi1234@cluster0.pwgqnav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

dns.setServers(['1.1.1.1','8.8.8.8']);
const dbConnect = async () => {
    try {
        const data = await mongoose.connect(process.env.MONGO_URI || url, )
        console.log('Db connected');

    } catch (err) {
        console.log(err);
    }
};

export default dbConnect;