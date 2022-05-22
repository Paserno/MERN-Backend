const { Schema, model } = require('mongoose');



const SolicitudSchema = Schema({
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    idJardinero: {
        type: Schema.Types.ObjectId,
        ref: 'Jardinero',
        required: true,
    },
    start: {
        type: Boolean,
        default: false,
    },
    finish: {
        type: Boolean,
        default: false,
    },
    confirmacion: {
        type: Boolean,
        required: true,
        default: false,
    },
},{
    timestamps: true
});


SolicitudSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Solicitud', SolicitudSchema)