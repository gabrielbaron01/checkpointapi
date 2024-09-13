// controllers/produtoController.js

const produtoRepository = require('../repository/produto-repository');

const createProduto = async (req, res) => {
  try {
    const produto = await produtoRepository.createProduto(req.body);
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getProduto = async (req, res) => {
  try {
    const produto = await produtoRepository.getProdutoById(req.params.id);
    if (produto) {
      res.json(produto);
    } else {
      res.status(404).send('Produto não encontrado');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateProduto = async (req, res) => {
  try {
    const produto = await produtoRepository.updateProdutoById(req.params.id, req.body);
    if (produto) {
      res.json(produto);
    } else {
      res.status(404).send('Produto não encontrado');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteProduto = async (req, res) => {
  try {
    const produto = await produtoRepository.deleteProdutoById(req.params.id);
    if (produto) {
      res.status(204).send();
    } else {
      res.status(404).send('Produto não encontrado');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllProdutos = async (req, res) => {
  try {
    const produtos = await produtoRepository.getAllProdutos();
    res.json(produtos);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  createProduto,
  getProduto,
  updateProduto,
  deleteProduto,
  getAllProdutos,
};
