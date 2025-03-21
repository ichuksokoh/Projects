import mongoose from "mongoose"
import { nanoid } from 'nanoid';


export interface ITest extends Document {
    _id: string;
    user_email: string;
    wpm: Number;
    raw_wpm: Number;
    characters: {
        correct_chars: Number;
        incorrect_chars: Number;
        missed_chars: Number;
        extra_chars: Number;
    };
    graph_data: Number[][];
    accuracy: Number;
    date: Date;
    user_id: string;
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
    raw_wpm: {
        type: Number,
        required: true
    },
    characters: {
        correct_chars: {
            type: Number,
            required: true
        },
        incorrect_chars: {
            type: Number,
            required: true
        },
        missed_chars: {
            type: Number,
            required: true
        },
        extra_chars:{
            type: Number,
            required: true
        }
    },
    graph_data: {
        type: [[Number]],
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
        type: String,
    }
  });

// testSchema.plugin(mongooseSequence, {inc_field: "_id"});

export const  Test  = mongoose.model<ITest>("Test", TestSchema, "tests");