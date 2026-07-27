import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import SystemLog from '../models/logModel.js';

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // 1. Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // 2. Hash the password
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        // 3. Save user to database
        const userId = await User.create({ name, email, password_hash, role });

        res.status(201).json({ message: 'User registered successfully!', userId });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // 2. Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // 3. Generate JWT containing id and role
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        console.log(user);
        

        // 4. Return token and basic user info to frontend
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        // Double-check authorization safeguard
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Administrative privileges required.' });
        }
       
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};


// ─── SUSPEND CONTROLLER ───────────────────────────────────────────
export const suspendUser = async (req, res) => {
    // Grab the user ID from the URL path parameter (e.g., /api/auth/users/7 -> req.params.id is 7)
    const { id } = req.params;

    try {
        const affectedRows = await User.delete(id);
       
        // If MySQL didn't find any row matching that ID, return a 404 error
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Target user record not found.' });
        }
        await SystemLog.write({
            user_id: req.user.id, // The Admin executing the deletion
            action_type: 'USER_SUSPENDED',
            description: `Admin purged user ID #${id} from the centralized registry matrix.`,
            ip_address: req.ip
        });
        res.status(200).json({ message: 'User account successfully suspended from registry.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error deleting user.', error: error.message });
    }
};

// ─── MODIFY CONTROLLER ────────────────────────────────────────────
export const modifyUser = async (req, res) => {
    const { id } = req.params;
    const { name, role } = req.body; // Capture the changes sent in the request body

    // Validation Guard
    if (!name || !role) {
        return res.status(400).json({ message: 'Name and role fields are required parameters.' });
    }

    try {
        const affectedRows = await User.update(id, { name, role });
       
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'User profile match not found.' });
        }

        await SystemLog.write({
            user_id: req.user.id, // The Admin executing the modifications
            action_type: 'USER_MODIFIED',
            description: `Admin modified profile properties for user ID #${id} to Name: "${name}", Role: "${role}".`,
            ip_address: req.ip
        });
       
        res.status(200).json({ message: 'User profile updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error modifying user profiles.', error: error.message });
    }
};