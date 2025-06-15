import mongoose from "mongoose";

export const connection = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.DB_URL_ONLINE)
        .then(() => {
            console.log(`Connected to MongoDB successfully on ${process.env.DB_URL_ONLINE}`);
        })
        .catch((err) => {
            console.log('Failed to Connect', err);
        });
}
  