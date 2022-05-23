const { Schema, model } = require('mongoose');



const TipoServicioSchema = Schema({
   nombre: {
        type: String,
        required: true,
    },
    Tarifa: {
        type: Number,
        required: false,
        default: 0,
    },
    estado: {
        type: Boolean,
        required: true,
        default: true,
    }
    
})


TipoServicioSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'TipoServicio', TipoServicioSchema)