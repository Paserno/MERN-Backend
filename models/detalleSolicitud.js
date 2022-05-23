const { Schema, model } = require('mongoose');


const DetalleSolicitudSchema = Schema({
    idSolicitud: {
        type: Schema.Types.ObjectId,
        ref: 'Solicitud',
        required: true,
    },
    idTipoServicio: {
        type: Schema.Types.ObjectId,
        ref: 'TipoServicio',
        required: true,
    },
    precio: {
        type: Number,
        default: 0,
    },
    estado: {
        type: Boolean,
        required: true,
        default: true,
    },
    realizado: {
        type: Boolean,
        required: true,
        default: false
    }
});


DetalleSolicitudSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'DetalleSolicitud', DetalleSolicitudSchema)