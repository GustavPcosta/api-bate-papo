const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require('../bd/db');


const login = async(req,res)=>{
    const {username,password} = req.body;

    try {
        const user = await db('users').where({username}).first();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
          }
          const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '2d' });
    res.status(200).json({ message: 'Login bem-sucedido.', token, user });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
}



module.exports ={
    login
}