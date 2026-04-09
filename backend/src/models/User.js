import mongoose  from "mongoose";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: ""
    },
    publicKey: {
        type: Object,
        default: "",
        required: true
    }
}, {timestamps: true})


const User = mongoose.model("User", userSchema);
export default User;