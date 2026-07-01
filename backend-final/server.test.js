const request = require("supertest");
const app = require("./server");

describe("API Sistema de Expedicao - Testes N3", () => {
  // Variáveis para guardar os IDs gerados e usar nos testes seguintes
  let funcionarioId;
  let pedidoId;
  let veiculoId;
  let expedicaoId;

  // ================= 1. FUNCIONÁRIOS =================
  describe("CRUD Funcionários e Erros", () => {
    test("POST /funcionarios deve criar funcionario", async () => {
      const response = await request(app)
        .post("/funcionarios")
        .send({
          nome: "Renan Teste",
          email: "renan@teste.com"
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.nome).toBe("Renan Teste");
      funcionarioId = response.body.id; // Guarda o ID
    });

    test("POST /funcionarios deve falhar sem campos obrigatórios (Validação)", async () => {
      const response = await request(app)
        .post("/funcionarios")
        .send({ nome: "Sem Email" }); // Faltando email propositalmente
      // SQLite retorna 500 por violar a constraint NOT NULL
      expect(response.statusCode).toBe(500); 
    });

    test("GET /funcionarios deve retornar lista paginada", async () => {
      const response = await request(app).get("/funcionarios?page=0&size=5");
      expect(response.statusCode).toBe(200);
      // Verifica se as propriedades da paginação estão no retorno
      expect(response.body).toHaveProperty("content");
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("size");
    });

    test("GET /funcionarios/:id deve retornar o funcionario criado", async () => {
      const response = await request(app).get(`/funcionarios/${funcionarioId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(funcionarioId);
    });

    test("PUT /funcionarios/:id deve atualizar o funcionario", async () => {
      const response = await request(app)
        .put(`/funcionarios/${funcionarioId}`)
        .send({
          nome: "Renan Atualizado",
          email: "renan.atualizado@teste.com"
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.mensagem).toBe("Funcionario atualizado");
    });
  });

  // ================= 2. VEÍCULOS =================
  describe("CRUD Veículos", () => {
    test("POST /veiculos deve criar um veiculo", async () => {
      const response = await request(app)
        .post("/veiculos")
        .send({
          placa: "ABC-1234",
          modelo: "Caminhão Baú"
        });
      expect(response.statusCode).toBe(201);
      veiculoId = response.body.id;
    });
  });

  // ================= 3. PEDIDOS =================
  describe("CRUD Pedidos", () => {
    test("POST /pedidos deve criar pedido vinculado ao funcionario", async () => {
      const response = await request(app)
        .post("/pedidos")
        .send({
          cliente: "Empresa Parceira",
          endereco: "Rua do Comércio, 100",
          funcionarioId: funcionarioId
        });
      expect(response.statusCode).toBe(201);
      pedidoId = response.body.id;
    });
  });

  // ================= 4. EXPEDIÇÕES (Relacionamento N:N) =================
  describe("CRUD Expedições (Tabela Intermediária)", () => {
    test("POST /expedicoes deve vincular o pedido ao veiculo", async () => {
      const response = await request(app)
        .post("/expedicoes")
        .send({
          pedidoId: pedidoId,
          veiculoId: veiculoId
        });
      expect(response.statusCode).toBe(201);
      expedicaoId = response.body.id;
    });
  });

  // ================= 5. RELACIONAMENTOS =================
  describe("Consultas de Relacionamentos", () => {
    test("GET /funcionarios/:id/pedidos deve retornar os pedidos", async () => {
      const response = await request(app).get(`/funcionarios/${funcionarioId}/pedidos`);
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    test("GET /pedidos/:id/veiculos deve retornar os veiculos do pedido", async () => {
      const response = await request(app).get(`/pedidos/${pedidoId}/veiculos`);
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  // ================= 6. EXCLUSÃO E TRATAMENTO DE ERROS =================
  describe("Limpeza de Registros (DELETE)", () => {
    // A exclusão ocorre de trás pra frente por causa das chaves estrangeiras
    test("DELETE /expedicoes/:id", async () => {
      const response = await request(app).delete(`/expedicoes/${expedicaoId}`);
      expect(response.statusCode).toBe(204);
    });

    test("DELETE /pedidos/:id", async () => {
      const response = await request(app).delete(`/pedidos/${pedidoId}`);
      expect(response.statusCode).toBe(204);
    });

    test("DELETE /veiculos/:id", async () => {
      const response = await request(app).delete(`/veiculos/${veiculoId}`);
      expect(response.statusCode).toBe(204);
    });

    test("DELETE /funcionarios/:id", async () => {
      const response = await request(app).delete(`/funcionarios/${funcionarioId}`);
      expect(response.statusCode).toBe(204);
    });

    test("GET /funcionarios/:id deve retornar 404 para registro excluído", async () => {
      const response = await request(app).get(`/funcionarios/${funcionarioId}`);
      // Testa o tratamento de erro de quando o registro não existe mais
      expect(response.statusCode).toBe(404);
      expect(response.body.mensagem).toBe("Funcionario nao encontrado");
    });
  });
});