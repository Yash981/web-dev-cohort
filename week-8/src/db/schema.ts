import mongoose from "mongoose";
const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  isAdmin: { type: Boolean, default: false },
  courses: [{ type: objectId, ref: 'Course' }] 
});

const AdminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const CourseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: {
    type: objectId,
    ref: "User",
  },
});

const purchaseSchema = new Schema({
  userId: {
    type: objectId,
    ref: "User",
  },
  courseId: {
    type: objectId,
    ref: "Course",
  },
});

const userModel = mongoose.model("User", userSchema);
const adminModel = mongoose.model("Admin", AdminSchema);
const courseModel = mongoose.model("Course", CourseSchema);
const purchaseModel = mongoose.model("Purchase", purchaseSchema);

export { userModel, adminModel, courseModel, purchaseModel };
