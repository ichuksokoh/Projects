import { Request, Response } from "express";
import { Test, ITest } from "../models/Test";


export const getTests = async (req: Request, res: Response) => {
    const userId = req?.params?.id;
    try {
        const query = { user_id: userId };
        const tests = await Test.find(query).sort({date: 1}).limit(50);

        if (tests) {
            res.status(200).send(tests);
        }
    } 
    catch (error) {
        res.status(404).send(`Unable to find matching documents with id: ${req.params.id}`);
    }

};

export const createTests = async (req: Request, res: Response) => {
    const { user_email, wpm, raw_wpm, characters, graph_data, accuracy, user_id } = req?.body;
    try {
        const result = await Test.create({ user_email: user_email, wpm: wpm, raw_wpm: raw_wpm,
            characters: characters, graph_data: graph_data, accuracy: accuracy, user_id: user_id });
        if (result) {
            res.status(200).send(`Test saved: ${result}`);
        }
    } 
    catch (error) {
        res.status(500).send(`Test save failure: ${error}`);
    }
};

export const updateTest = async (req: Request, res: Response) => {
    const testId = req?.params?.id; 
    const { wpm, accuracy } = req?.body;

    try {
        const result = await Test.findById(testId);
        if (!result) {
            res.status(404).send('Test not found');
        }
        if (result) {
            result.wpm = wpm;
            result.accuracy = accuracy;
            const updatedTest = await result.save();

            res.status(200).send(`Updated Test: ${updatedTest}`);
        }
    } 
    catch (error) {
        res.status(500).send(`Updated Test failed: ${error}`);
    }
};

export const deleteTest = async (req: Request, res: Response) => {
    const testId = req?.params?.id;
    try {
        const result = await Test.deleteOne({ _id: testId });
        if (result) {
            res.status(200).send('Test deleted successfully');
        }
        else {
            res.status(400).send('Deletion Failed');
        }
    }
    catch (error) {
        res.status(500).send('internal server error');
    }
};