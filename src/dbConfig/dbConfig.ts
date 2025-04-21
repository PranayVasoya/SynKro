import mongoose from 'mongoose';

export async function connectToDatabase() {
    try {
        mongoose.connect(process.env.MONGO_URI!,)
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })
        connection.on('error', (err) => {
            console.log('MongoDB connection erro, please make sure DB is up and running.' + err);
            process.exit();
        })
    } catch (error){
        console.log('Something went wrong while connecting to the database', error);
    }
}

