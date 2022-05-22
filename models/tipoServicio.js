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
    
})


TipoServicioSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'TipoServicio', TipoServicioSchema)