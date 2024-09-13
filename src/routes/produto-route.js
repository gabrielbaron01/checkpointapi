
const express = require('express');
const router = express.Router();
const Produto = require('../models/produto');


router.post('/produtos', async (req, res) => {
    try {
        const produto = new Produto(req.body);
        await produto.save();
        res.status(201).json(produto); 
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar produto', error });
    }
});


router.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produtos', error });
    }
});

router.put('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, preco, descricao, estoque } = req.body;

    try {
        const produtoAtualizado = await Produto.findByIdAndUpdate(
            id,
            { nome, preco, descricao, estoque },
            { new: true }
        );

        if (!produtoAtualizado) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.status(200).json(produtoAtualizado);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar produto', error });
    }
});

module.exports = router;
