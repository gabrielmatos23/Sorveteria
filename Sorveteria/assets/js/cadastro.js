// assets/js/cadastro.js
import { salvarProduto, atualizarProduto, getProdutos } from './crud.js';

const form = document.getElementById('form-produto');
const preview = document.getElementById('preview');
const fotoInput = document.getElementById('foto');
const urlParams = new URLSearchParams(window.location.search);
const idEdicao = urlParams.get('editar');
const produtos = getProdutos();

let imagemBase64 = '';

/* 
  Pré-visualização da imagem selecionada:
  - Quando o usuário escolhe uma foto, converte o arquivo em base64 
  - Atualiza a imagem de preview para mostrar a foto selecionada 
*/
fotoInput.addEventListener('change', () => {
  const file = fotoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imagemBase64 = reader.result;
      preview.src = imagemBase64;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

/* 
  Se o parâmetro "editar" existir na URL:
  - Altera o título do formulário para "Editar Produto"
  - Busca o produto correspondente e preenche os campos do formulário
  - Exibe a imagem atual no preview
*/
if (idEdicao) {
  document.getElementById('titulo-form').innerText = 'Editar Produto';
  const produto = produtos.find(p => p.id === idEdicao);
  if (produto) {
    form.nome.value = produto.nome;
    form.tipo.value = produto.tipo;
    form.categoria.value = produto.categoria;
    form.preco.value = produto.preco;
    form.estoque.value = produto.estoque;
    if (produto.imagem) {
      preview.src = produto.imagem;
      preview.style.display = 'block';
      imagemBase64 = produto.imagem;
    }
  }
}

/* 
  Envio do formulário:
  - Impede o envio padrão da página
  - Cria um objeto produto com os dados do formulário e imagem em base64
  - Se for edição, chama atualizarProduto; senão, chama salvarProduto
  - Redireciona para a página inicial após salvar/atualizar
*/
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const produto = {
    nome: form.nome.value,
    tipo: form.tipo.value,
    categoria: form.categoria.value,
    preco: parseFloat(form.preco.value),
    estoque: parseInt(form.estoque.value),
    imagem: imagemBase64
  };

  if (idEdicao) {
    atualizarProduto(idEdicao, produto);
  } else {
    salvarProduto(produto);
  }

  window.location.href = 'index.html';
});
