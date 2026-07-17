import Field from '../models/fieldModel.js';

export const getAllFields = async (req, res) => {
    try {
        let fields;
       
        // Admin gets to see everything, Farmers only see their own fields
        if (req.user.role === 'admin') {
            fields = await Field.getAll();
        } else {
            // We need a method to get fields by specific farmer ID
            fields = await Field.getByFarmerId(req.user.id);
        }
       
        res.status(200).json(fields);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving fields', error: error.message });
    }
};

export const createField = async (req, res) => {
    const { name, location, size } = req.body;
    const farmerId = req.user.id; // Extracted from the validated JWT token

    try {
        const fieldId = await Field.create(farmerId, name, location, size);
        res.status(201).json({ message: 'Field created successfully', fieldId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating field', error: error.message });
    }
};