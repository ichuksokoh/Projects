import mongoose from "mongoose"
import { nanoid } from 'nanoid';


export interface ITest extends Document {
    _id: string;
    user_email: string;
    wpm: Number;
    accuracy: Number;
    date: Date;
    user_id: Number;
}

const TestSchema = new mongoose.Schema<ITest>({
    _id: {
        type: String,
        default: () => nanoid(),
    },
    user_email: { 
        type: String,
        required: true 
    },
    wpm: { 
        type: Number, 
        required: true 
    },
    accuracy: { 
        type: Number, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    user_id: {
        type: Number,
    }
  });

// testSchema.plugin(mongooseSequence, {inc_field: "_id"});

export const  Test  = mongoose.model<ITest>("Test", TestSchema, "tests");