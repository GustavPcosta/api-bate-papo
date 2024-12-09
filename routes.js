const express = require('express');
const { createdUsers, updatedUsers, deleteUser, getOneUsers } = require('./controller/users');
const { login } = require('./Login/login');
const { saveMensage, getMessage } = require('./controller/chat');

const routs = express.Router();

routs.post('/register',createdUsers);
routs.put("/userUpdated/:id", updatedUsers);
routs.delete('/deleteUsers/:id', deleteUser);
routs.get("/users/:id", getOneUsers);


routs.post('/login', login);



routs.post("/messages", saveMensage);
routs.get("/messages/:room",getMessage);
module.exports = routs;