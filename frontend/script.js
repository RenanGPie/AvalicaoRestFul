const API = "http://localhost:3000";

async function listarFuncionarios() {
  const resposta = await fetch(`${API}/funcionarios`);
  const funcionarios = await resposta.json();

  const lista = document.getElementById("listaFuncionarios");
  lista.innerHTML = "";

  funcionarios.forEach(funcionario => {
    const item = document.createElement("li");

    item.innerHTML = `
      ${funcionario.nome} - ${funcionario.email}
      <button onclick="excluirFuncionario(${funcionario.id})">
        Excluir
      </button>
    `;

    lista.appendChild(item);
  });
}

async function cadastrarFuncionario() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;

  await fetch(`${API}/funcionarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome,
      email
    })
  });

  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";

  listarFuncionarios();
}

async function excluirFuncionario(id) {
  await fetch(`${API}/funcionarios/${id}`, {
    method: "DELETE"
  });

  listarFuncionarios();
}

listarFuncionarios();