const express = require('express');

const app = express();

app.use(express.json()); //middelware

let users = []; // in-memory user storage

app.post('/register', (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response.status(400).json({ 
            message: 'Name, Email, Password are required'  
        });
    }

    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password // Note: In production, passwords should be hashed
    }


    users.push(newUser);

    return response.status(200).json({
        message: 'User registered successfully',
        user: { 
            id: newUser.id

         }
    });
});

    app.listen(5001, () => {
        console.log('Server is running on port 5001');
    });