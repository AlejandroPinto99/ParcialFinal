const mongoose = require('mongoose');
Schema = mongoose.Schema;

var personajesSchema = Schema({
    nombre: {
        type: String,
        require: true,
        unique: true, 
    }, 
    apellido: String,
    asiste: Boolean,
    muggle: Boolean
});

module.exports = mongoose.model("personajes", personajesSchema);
