import mongoose from "mongoose";

const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const userSchema = new Schema({
    username: String,
    password: String,
    email: { type: String,unique: true} 
})
const TodosSchema = new Schema({
    userId: objectId,
    title: String,
    description: String,
    done: Boolean,
    timestamp:Date
})


export const UserModel = mongoose.model('User', userSchema);
export const TodosModel = mongoose.model('Todos', TodosSchema);

