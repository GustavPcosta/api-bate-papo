const db = require("../bd/db");

const saveMensage = async(req,res)=>{
    const {content, room, sender} = req.body;


try {
    const saveChat = await db("messages").insert({
        content,
        room,
        sender
    })
    if(!saveChat){
        return res.status(400).json({message: "Não foi possível enviar a menssagem"});
    }
    res.json({message: "Menssagem enviada com sucesso"});
} catch (error) {
    return res.status(500).json({mensage:"erro interno"})
}
}

const deletarMenssage = async(req,res)=>{
    const {id} = req.params;
    try {
    const messageDelete = await db("messages").where({id}).del();
        if(!messageDelete){
            return res.status(400).json({message: "Não foi possível deletar a menss"})

        }
    res.status(200).json(messageDelete)
    } catch (error) {
        return res.status(500).json({mensage:"erro interno"})
    }
}

const getMessage = async (req, res) => {
    const { room } = req.params;

    if (!room) {
        return res.status(400).json({ message: "O nome da sala é obrigatório." });
    }

    try {
        const messages = await db('messages')
            .where({ room })
            .orderBy('created_at', 'asc'); 
        return res.json(messages);
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        return res.status(500).json({ message: "Erro interno ao buscar mensagens." });
    }
};

module.exports = {
    saveMensage,
    deletarMenssage,
    getMessage
}