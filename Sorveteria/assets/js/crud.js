// CRUD utilitário para o localStorage

// Retorna todos os produtos armazenados
export function getProdutos() {
  return JSON.parse(localStorage.getItem('produtos')) || [];
}

// Salva um novo produto com ID único
export function salvarProduto(produto) {
  const produtos = getProdutos();
  const novoProduto = {
    id: crypto.randomUUID(), // Gera um ID único para o produto
    ...produto
  };
  produtos.push(novoProduto);
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Atualiza um produto já existente
export function atualizarProduto(id, novoProduto) {
  const produtos = getProdutos();
  const index = produtos.findIndex(p => p.id === id);
  if (index !== -1) {
    produtos[index] = { ...produtos[index], ...novoProduto };
    localStorage.setItem('produtos', JSON.stringify(produtos));
  }
}

// Exclui um produto pelo ID
export function excluirProduto(id) {
  const produtosAtualizados = getProdutos().filter(p => p.id !== id);
  localStorage.setItem('produtos', JSON.stringify(produtosAtualizados));
}
