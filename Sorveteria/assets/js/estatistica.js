document.addEventListener('DOMContentLoaded', () => {
  // Recupera a lista de produtos do localStorage ou cria um array vazio
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

  // Cria arrays únicos de tipos e categorias para uso nos gráficos
  const tipos = [...new Set(produtos.map(p => p.tipo))];
  const categorias = [...new Set(produtos.map(p => p.categoria))];

  // Calcula a quantidade de produtos por tipo
  const contagemTipos = tipos.map(tipo =>
    produtos.filter(p => p.tipo === tipo).length
  );

  // Calcula o estoque total por categoria
  const estoqueCategorias = categorias.map(cat =>
    produtos
      .filter(p => p.categoria === cat)
      .reduce((acc, p) => acc + p.estoque, 0)
  );

  // Calcula o valor total do estoque (preço * quantidade)
  const valorTotal = produtos.reduce((acc, p) => acc + (p.preco * p.estoque), 0);

  // Configuração e criação do gráfico de barras para quantidade por tipo
  new Chart(document.getElementById('graficoTipo'), {
    type: 'bar',
    data: {
      labels: tipos,
      datasets: [{
        label: 'Quantidade',
        data: contagemTipos,
        backgroundColor: ['#ff69b4', '#dda0dd', '#87cefa', '#ffcccb', '#90ee90']
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });

  // Configuração e criação do gráfico doughnut para estoque por categoria
  new Chart(document.getElementById('graficoCategoria'), {
    type: 'doughnut',
    data: {
      labels: categorias,
      datasets: [{
        label: 'Estoque',
        data: estoqueCategorias,
        backgroundColor: ['#ffb6c1', '#d8bfd8', '#ffe4e1', '#f0e68c', '#add8e6']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

  // Preenche a tabela de produtos com as informações de cada produto
  const tabela = document.getElementById('tabelaProdutos');
  if (produtos.length === 0) {
    tabela.innerHTML = `<tr><td colspan="6">Nenhum produto cadastrado.</td></tr>`;
  } else {
    tabela.innerHTML = produtos.map(p => {
      const valorTotalItem = p.preco * p.estoque;
      return `
      <tr>
        <td>${p.nome}</td>
        <td>${p.tipo}</td>
        <td>${p.categoria}</td>
        <td>R$ ${p.preco.toFixed(2)}</td>
        <td>${p.estoque}</td>
        <td>R$ ${valorTotalItem.toFixed(2)}</td>
      </tr>
      `;
    }).join('');
  }

  // Atualiza o valor total do estoque exibido na página
  document.getElementById('valorTotal').textContent = `R$ ${valorTotal.toFixed(2)}`;
});
