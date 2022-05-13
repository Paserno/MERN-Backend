const { Mensaje } = require('../models');



const obtenerChat = async (req, res) => {



    const { _id: miId }  = req.usuario;
    const mensajesDe = req.params.de;
    try {
        const last30 = await Mensaje.find({
            $or: [
                { de: miId, para: mensajesDe },
                { de: mensajesDe, para: miId },
            ]
        })
            .sort({ createdAt: 'asc' })
            .limit(30);
    
        res.json({
            ok: true,
            last30,
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        });
    }



}
module.exports = {
    obtenerChat
}

