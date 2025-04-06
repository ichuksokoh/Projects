import mongoose, { Schema, model } from "mongoose";
import { nanoid } from "nanoid";
import mongooseSequence from "mongoose-sequence";
import bcrypt from "bcryptjs";

const AutoIncrement =(mongooseSequence as any)(mongoose);

interface IUser extends Document {
    _id: string;
    user_email: string;
    password: string;
    user_since: Date;
    verifyPw(password: string): Promise<boolean>;
    refresh_tokens: {token: string, expiryDate: Date}[],
  }
  

const UserSchema = new Schema<IUser>({
    _id: {
        type: String,
        required: true,
        default: () => nanoid(),
    },
    user_email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    user_since: {
        type: Date,
        required: true,
        default: Date.now,
    },
    password: {
        type: String,
        required: true,
    },
    refresh_tokens: {
        type: [{
            expiryDate: Date,
            token: String,
            _id: false, 
        }],
        required: true,
        default: []
    }
})


UserSchema.methods.verifyPw = async function (password: string) {
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
}


export const User = model<IUser>("User", UserSchema, "users")