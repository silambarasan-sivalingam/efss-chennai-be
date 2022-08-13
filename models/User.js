import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({

     name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 1,
        maxlength: 20,
        trim: true,
      },
    
     email: {
        type: String,
        required: [true, "Please provide email"],
        validate:{
            validator: validator.isEmail,
            message: 'Please provide valid email'
        },
        unique: true,
      },
    
      password: {
        type: String,
        required: [true, "Please provide password"],
        maxlength: 20,
        trim: true,
        select: false
      },
    
      lastName: {
        type: String,
        maxlength: 20,
        trim: true,
        default: "lastName",
      },
    
      location: {
        type: String,
        default: "chennai",
        maxlength: 20,
        trim: true,
      },

      role: {
        type: String,
        enum:['admin', 'user', 'reader'],
        default: "user",
        required: [true, "Please provide role"],
        maxlength: 20,
        trim: true,
      },

})

UserSchema.pre('save', async function(){
    // console.log(this.modifiedPaths())
    if(!this.isModified('password')) return 
    const salt = await bcrypt.genSalt(2);
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function(){
    return jwt.sign({userId: this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME})
  }

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password) 
    return isMatch
}

export default mongoose.model('User', UserSchema )