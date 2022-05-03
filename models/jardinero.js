const { Schema, model } = require('mongoose');



const JardineroSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    especialidad: {
        type: String,
        required: true,
    },
    estado: {
        type: Boolean,
        required: true,
    },
    activo: {
        type: Boolean,
        required: true,
        default: false,
    },
    descripcion: {
        type: String,
    }
});


ProductoSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Jardinero', JardineroSchema)