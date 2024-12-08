const db = require("../bd/db");
const bcrypt = require("bcrypt");


const createdUsers = async (req, res) => {
    const { username, password } = req.body;

    try {
        
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const users = await db("users").insert({
            username,
            password: hashedPassword, 
        });

        
        if (!users) {
            return res.status(400).json({ message: "User not created" });
        }

        res.json({ message: "User created successfully" });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return res.status(500).json(error);
    }
};


const updatedUsers = async(req,res) =>{
    const { id } = req.params;
    const {username, password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const usersUpdate = await db('users').where({id}).update({
            username,
            password:hashedPassword
        })
        if(!usersUpdate){
            return res.status(400).json({message: "User not updated"})
        }
        return res.status(200).json({message:"User updated with sucessfull"})

    } catch (error) {
        return res.status(500).json(error)

    }
}

const getOneUsers = async(req,res)=>{
    const {id} = req.params;
    try {
    const getUser = await db("users").where({id}).first();
    if(!getUser){
        return res.status(400).json({message: "Usuário não encontrado"})
        }
        return res.status(200).json({ message: 'Conta encontrada com sucesso.', getUser });
    } catch (error) {
        console.error(`Erro ao buscar a conta com ID ${id}:`, err);
         return res.status(500).json({ message: 'Erro interno ao buscar a conta.', error: err.message });
        
    }
}
const deleteUser = async(req,res)=>{
    const {id} = req.params;
    try {
        const deleteUsers = await db('users').where({id}).del();
        if(!deleteUsers){
            return res.status(400).json({message: "User not deleted"})
            }
            return res.status(200).json({message: "User deleted with sucessfull"})
    } catch (error) {
        return res.status(500).json(error)
    }
}
module.exports = {
    createdUsers,
    updatedUsers,
    deleteUser,
    getOneUsers
}
