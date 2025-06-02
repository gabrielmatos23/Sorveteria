document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('lista-produtos');
  const searchInput = document.getElementById('search-produtos');
  let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  let produtosFiltrados = [...produtos];

  const modal = document.getElementById('modal-editar');
  const btnFechar = document.querySelector('.fechar-modal');
  const formEditar = document.getElementById('form-editar');

  const selectTipo = document.getElementById('edit-tipo');
  const selectCategoria = document.getElementById('edit-categoria');

  // Preenche os selects com tipos e categorias únicos
  function preencherSelects() {
    const tipos = [...new Set(produtos.map(p => p.tipo))];
    const categorias = [...new Set(produtos.map(p => p.categoria))];

    selectTipo.innerHTML = tipos.map(t => `<option value="${t}">${t}</option>`).join('');
    selectCategoria.innerHTML = categorias.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  function renderizarLista() {
    lista.innerHTML = '';

    if (produtosFiltrados.length === 0) {
      lista.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }

    produtosFiltrados.forEach((produto, index) => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        ${produto.imagem ? `<img src="${produto.imagem}" alt="Imagem de ${produto.nome}" />` : ''}
        <h3>${produto.nome}</h3>
        <p><strong>Tipo:</strong> ${produto.tipo}</p>
        <p><strong>Categoria:</strong> ${produto.categoria}</p>
        <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
        <p><strong>Estoque:</strong> ${produto.estoque}</p>
        <button class="btn-editar" data-index="${index}">Editar</button>
        <button class="btn-excluir" data-index="${index}">Excluir</button>
      `;

      lista.appendChild(card);
    });

    adicionarEventos();
  }

  function adicionarEventos() {
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.dataset.index;
        const produto = produtosFiltrados[index];
        const indiceOriginal = produtos.indexOf(produto);

        document.getElementById('edit-id').value = indiceOriginal;
        document.getElementById('edit-nome').value = produto.nome;
        selectTipo.value = produto.tipo;
        selectCategoria.value = produto.categoria;
        document.getElementById('edit-preco').value = produto.preco;
        document.getElementById('edit-estoque').value = produto.estoque;

        const preview = document.getElementById('edit-preview');
        if (produto.imagem) {
          preview.src = produto.imagem;
          preview.style.display = 'block';
        } else {
          preview.src = '';
          preview.style.display = 'none';
        }

        modal.style.display = 'flex';
      });
    });

    document.querySelectorAll('.btn-excluir').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.dataset.index;
        const produto = produtosFiltrados[index];
        const indiceOriginal = produtos.indexOf(produto);
        produtos.splice(indiceOriginal, 1);
        localStorage.setItem('produtos', JSON.stringify(produtos));
        filtrarProdutos(searchInput.value);
        preencherSelects();
      });
    });
  }

  btnFechar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  formEditar.addEventListener('submit', (e) => {
    e.preventDefault();

    const index = document.getElementById('edit-id').value;
    const nome = document.getElementById('edit-nome').value;
    const tipo = selectTipo.value;
    const categoria = selectCategoria.value;
    const preco = parseFloat(document.getElementById('edit-preco').value);
    const estoque = parseInt(document.getElementById('edit-estoque').value);
    const fotoInput = document.getElementById('edit-foto');
    const reader = new FileReader();

    const atualizar = (novaImagemBase64 = null) => {
      produtos[index] = {
        ...produtos[index],
        nome,
        tipo,
        categoria,
        preco,
        estoque,
        imagem: novaImagemBase64 || produtos[index].imagem
      };

      localStorage.setItem('produtos', JSON.stringify(produtos));
      modal.style.display = 'none';
      filtrarProdutos(searchInput.value);
      preencherSelects();
    };

    if (fotoInput.files.length > 0) {
      reader.onload = () => atualizar(reader.result);
      reader.readAsDataURL(fotoInput.files[0]);
    } else {
      atualizar();
    }
  });

  function filtrarProdutos(texto) {
    const filtro = texto.trim().toLowerCase();
    if (!filtro) {
      produtosFiltrados = [...produtos];
    } else {
      produtosFiltrados = produtos.filter(p => p.nome.toLowerCase().includes(filtro));
    }
    renderizarLista();
  }

  searchInput.addEventListener('input', e => {
    filtrarProdutos(e.target.value);
  });

  preencherSelects();
  filtrarProdutos('');
});
