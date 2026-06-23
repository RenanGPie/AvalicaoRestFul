const request = require("supertest");
const app = require("./server");

describe("API Funcionarios", () => {

  test("GET /funcionarios deve retornar 200", async () => {
    const response = await request(app).get("/funcionarios");

    expect(response.statusCode).toBe(200);
  });

  test("POST /funcionarios deve criar funcionario", async () => {
    const response = await request(app)
      .post("/funcionarios")
      .send({
        nome: "Teste Jest",
        email: "teste@jest.com"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.nome).toBe("Teste Jest");
  });

});

test("GET /funcionarios/1 deve retornar 200 ou 404", async () => {
  const response = await request(app).get("/funcionarios/1");

  expect([200, 404]).toContain(response.statusCode);
});

test("PUT /funcionarios/1 deve atualizar", async () => {
  const response = await request(app)
    .put("/funcionarios/1")
    .send({
      nome: "Funcionario Atualizado",
      email: "atualizado@email.com"
    });

  expect(response.statusCode).toBe(200);
});

test("DELETE /funcionarios/1", async () => {
  const response = await request(app)
    .delete("/funcionarios/1");

  expect(response.statusCode).toBe(204);
});