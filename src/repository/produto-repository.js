

const Produto = require('../models/produto');

const createProduto = async (produtoData) => {
  const produto = new Produto(produtoData);
  return await produto.save();
};

const getProdutoById = async (id) => {
  return await Produto.findById(id);
};

const updateProdutoById = async (id, produtoData) => {
  return await Produto.findByIdAndUpdate(id, produtoData, { new: true });
};


const deleteProdutoById = async (id) => {
  return await Produto.findByIdAndDelete(id);
};


const getAllProdutos = async () => {
  return await Produto.find();
};

module.exports = {
  createProduto,
  getProdutoById,
  updateProdutoById,
  deleteProdutoById,
  getAllProdutos,
};
