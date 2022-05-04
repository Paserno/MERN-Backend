const { Schema, model } = require('mongoose');



const JardineroSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        unique: false,
    },
    especialidad: {
        type: String,
        required: true,
    },
    estado: {
        type: Boolean,
        required: true,
        default: true,
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


JardineroSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Jardinero', JardineroSchema)