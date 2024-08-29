const express = require('express');
const router = express.Router();
const { generateItemId } = require('../../Other');
const nutritionModel = require('../../../Models/Alternative_Therapies/nutrition');

const createNutritionEntry = async (req, res) => {
    let nutritionId
    try {
        let res = await generateItemId(nutritionModel)
        nutritionId = res
    } catch (error) {


        res.status(500).send('Error! Please Try Again')
    }

    try {
        const nutritionData = req.body;
        const newNutritionEntry = new nutritionModel({ ...nutritionData, nutritionId: nutritionId });
        const savedNutritionEntry = await newNutritionEntry.save();
        res.status(201).json({ message: 'nutrition entry created successfully', nutritionEntry: 'savedNutritionEntry' });
    } catch (error) {


        console.error('Error creating nutrition entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateNutritionEntry = async (req, res) => {
    try {
        const nutritionId = req.params.id;
        const updatedData = req.body;
        const updatedNutritionEntry = await nutritionModel.findOneAndUpdate({ nutritionId: nutritionId }, updatedData, { new: true });

        res.json({ message: 'nutrition entry updated successfully', nutritionEntry: updatedNutritionEntry });
    } catch (error) {


        console.error('Error updating nutrition entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getNutritionEntries = async (req, res) => {
    const { page = 1, limit = 10, } = req.query;
    const skip = (page - 1) * limit;
    try {
        const updatedNutritionEntry = await nutritionModel.find({}).skip(skip).limit(limit);
        res.json(updatedNutritionEntry);
    } catch (error) {


        console.error('Error updating nutrition entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getNutritionEntry = async (req, res) => {
    const nutritionId = req.params.id

    try {
        const NutritionEntry = await nutritionModel.find({ nutritionId });
        res.json(NutritionEntry);
    } catch (error) {


        console.error('Error updating nutrition entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteNutritionEntry = async (req, res) => {
    try {
        const nutritionId = req.params.id;
        await nutritionModel.findByIdAndDelete(nutritionId);
        res.json({ message: 'nutrition entry deleted successfully' });
    } catch (error) {


        console.error('Error deleting nutrition entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createNutritionEntry,
    updateNutritionEntry,
    deleteNutritionEntry,
    getNutritionEntries,
    getNutritionEntry
};
