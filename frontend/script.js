const API = "http://localhost:3000";

// ================== FUNCIONÁRIOS ==================

async function listarFuncionarios() {
  // 1. Correção da paginação: passando os parâmetros na URL
  const resposta = await fetch(`${API}/funcionarios?page=0&size=10`);
  const dados = await resposta.json();
  
  // A lista de funcionários agora fica dentro de dados.content
  const funcionarios = dados.content; 

  const lista = document.getElementById("listaFuncionarios");
  lista.innerHTML = "";

  funcionarios.forEach(funcionario => {
    const item = document.createElement("li");

    // 2. Adição dos botões de Editar e Ver Relacionamentos
    item.innerHTML = `
      ${funcionario.nome} - ${funcionario.email}
      <button onclick="prepararEdicao(${funcionario.id}, '${funcionario.nome}', '${funcionario.email}')">Editar</button>
      <button onclick="excluirFuncionario(${funcionario.id})">Excluir</button>
      <button onclick="verPedidosDoFuncionario(${funcionario.id})">Ver Pedidos</button>
    `;

    lista.appendChild(item);
  });
}

async function cadastrarFuncionario() {
  // Pegamos o ID oculto para saber se é um Novo Cadastro ou uma Edição
  const id = document.getElementById("funcionarioId").value; 
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;

  if (id) {
    // Se existe ID, fazemos a EDIÇÃO (PUT)
    await fetch(`${API}/funcionarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email })
    });
  } else {
    // Se NÃO existe ID, fazemos o CADASTRO (POST)
    await fetch(`${API}/funcionarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email })
    });
  }

  limparFormulario();
  listarFuncionarios();
}

function prepararEdicao(id, nome, email) {
  // Joga os dados do card para dentro dos inputs para o usuário editar
  document.getElementById("funcionarioId").value = id;
  document.getElementById("nome").value = nome;
  document.getElementById("email").value = email;
  document.getElementById("btnSalvar").innerText = "Atualizar Funcionário";
}

function limparFormulario() {
  document.getElementById("funcionarioId").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
  document.getElementById("btnSalvar").innerText = "Cadastrar Funcionário";
}

async function excluirFuncionario(id) {
  await fetch(`${API}/funcionarios/${id}`, {
    method: "DELETE"
  });
  listarFuncionarios();
}

// ================== RELACIONAMENTOS ==================

async function verPedidosDoFuncionario(funcionarioId) {
  // 3. Consumo da rota de relacionamento
  const resposta = await fetch(`${API}/funcionarios/${funcionarioId}/pedidos`);
  const pedidos = await resposta.json();

  const painelRelacionamentos = document.getElementById("painelRelacionamentos");
  painelRelacionamentos.innerHTML = `<h3>Pedidos do Funcionário #${funcionarioId}</h3>`;

  if (pedidos.length === 0) {
    painelRelacionamentos.innerHTML += "<p>Nenhum pedido encontrado para este funcionário.</p>";
    return;
  }

  const ul = document.createElement("ul");
  pedidos.forEach(pedido => {
    ul.innerHTML += `<li>Pedido #${pedido.id} | Cliente: ${pedido.cliente} | Endereço: ${pedido.endereco}</li>`;
  });
  
  painelRelacionamentos.appendChild(ul);
}

// Inicializa a tela buscando a lista
listarFuncionarios();