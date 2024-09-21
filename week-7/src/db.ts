import mongoose from "mongoose";

const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const userSchema = new Schema({
    username: String,
    password: String,
    email: { type: String,unique: true} 
})
const TodosSchema = new Schema({
    userId: { type: objectId, ref: 'User' },
    title: String,
    description: String,
    done: Boolean,
    timestamp:{ type: Date, default: Date.now }
})


export const UserModel = mongoose.model('User', userSchema);
export const TodosModel = mongoose.model('Todos', TodosSchema);

