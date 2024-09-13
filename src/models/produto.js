// models/produto-model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produtoSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    descricao: {
        type: String
    },
    estoque: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Produto', produtoSchema);
