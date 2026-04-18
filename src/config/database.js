import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config()

export const connectDB = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('Database connection error');
            mongoose.disconnect();
        });

        mongoose.connection.on('connecting', () => console.log('MONGODB | try connecting...'));
        mongoose.connection.on('connected', () => console.log('MONGODB | connected'));
        mongoose.connection.on('open', () => console.log('MONGODB | connected to database'));
        mongoose.connection.on('disconnected', () => console.log('MONGODB | disconnected'));
        mongoose.connection.on('reconnected', () => console.log('MONGODB | reconnected to mongodb'));

        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(`Error de conexion: ${error.message}`);
        process.exit(1);
    }
}