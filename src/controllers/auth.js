const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Password = require('../models/Password');

//Signup API
const signup = async (req, res) => {
    const { USER_NAME, PASSWORD } = req.body;
    try {
        //Check if user already exists
        const existingUser = await User.findOne({ where: { USER_NAME } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //Generate a userProfileId 
        //TODO: Need to guarantee a unique value will be set.
        const userProfileId = Math.floor(1000 + Math.random()*9000)

        //Create a new user
        const user = await User.create({ USER_NAME, USER_PROFILE_ID: userProfileId});

        //Hash password and store in Passwords Table
        const hashedPassword = await bcrypt.hash(password, 10);
        await Password.create({ USER_ID: user.USER_ID, PASSWORD: hashedPassword, ACTIVE: true });

        res.status(201).json({ message: 'User created successfully', userProfileId: userProfileId });
    } catch (error) {
        console.error('Error in signup', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Login API
const login = async (req, res) => {
    const { USER_NAME, PASSWORD } = req.body;

    try {
        //Find user by username
        const user = await User.findOne({ where: {USER_NAME } });
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //Find active password for the user
        let userPassword = await Password.findOne({
            where: {
                USER_ID: user.USER_ID,
                ACTIVE: true
            }
        });

        if(!userPassword) {
            const userPasswords = await Password.findAll({
                where: {
                    USER_ID: user.USER_ID
                }
            });

            if(!userPasswords || userPasswords.length == 0) {
                return res.status(500).json({ message: `Internal Server Error: No password tied to username ${user.USER_NAME} in database.`})
            }

            userPasswords.sort((a, b) => a.PASSWORD_SEQ - b.PASSWORD_SEQ);
            userPassword = userPasswords[userPasswords.length - 1];
        }

        //Compare password from request and password in database.
        const isPasswordValid = await bcrypt.compare(password, userPassword.PASSWORD);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    signup,
    login
}