const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API Sistema de Expedição",
    version: "1.0.0",
    description: "Projeto N3 - Sistema de Expedição"
  },
  servers: [
    {
      url: "http://localhost:3000"
    }
  ],
  paths: {
    "/funcionarios": {
      get: {
        summary: "Listar funcionários",
        responses: {
          200: {
            description: "Lista de funcionários"
          }
        }
      },
      post: {
        summary: "Cadastrar funcionário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: {
                    type: "string"
                  },
                  email: {
                    type: "string"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Funcionário criado"
          }
        }
      }
    },

    "/funcionarios/{id}": {
      get: {
        summary: "Buscar funcionário por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          200: {
            description: "Funcionário encontrado"
          }
        }
      },
      put: {
        summary: "Atualizar funcionário",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          200: {
            description: "Funcionário atualizado"
          }
        }
      },
      delete: {
        summary: "Excluir funcionário",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          204: {
            description: "Funcionário removido"
          }
        }
      }
    },

    "/pedidos": {
      get: {
        summary: "Listar pedidos",
        responses: {
          200: {
            description: "Lista de pedidos"
          }
        }
      },
      post: {
        summary: "Cadastrar pedido",
        responses: {
          201: {
            description: "Pedido criado"
          }
        }
      }
    },

    "/veiculos": {
      get: {
        summary: "Listar veículos",
        responses: {
          200: {
            description: "Lista de veículos"
          }
        }
      },
      post: {
        summary: "Cadastrar veículo",
        responses: {
          201: {
            description: "Veículo criado"
          }
        }
      }
    },

    "/expedicoes": {
      get: {
        summary: "Listar expedições",
        responses: {
          200: {
            description: "Lista de expedições"
          }
        }
      },
      post: {
        summary: "Cadastrar expedição",
        responses: {
          201: {
            description: "Expedição criada"
          }
        }
      }
    },

    "/funcionarios/{id}/pedidos": {
      get: {
        summary: "Pedidos de um funcionário",
        responses: {
          200: {
            description: "Pedidos encontrados"
          }
        }
      }
    },

    "/pedidos/{id}/veiculos": {
      get: {
        summary: "Veículos de um pedido",
        responses: {
          200: {
            description: "Veículos encontrados"
          }
        }
      }
    },

    "/veiculos/{id}/pedidos": {
      get: {
        summary: "Pedidos de um veículo",
        responses: {
          200: {
            description: "Pedidos encontrados"
          }
        }
      }
    }
  }
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const db = new sqlite3.Database("./expedicao.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS funcionarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT NOT NULL,
      endereco TEXT NOT NULL,
      funcionarioId INTEGER,
      FOREIGN KEY(funcionarioId) REFERENCES funcionarios(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS veiculos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      placa TEXT NOT NULL,
      modelo TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS expedicoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedidoId INTEGER,
      veiculoId INTEGER,
      FOREIGN KEY(pedidoId) REFERENCES pedidos(id),
      FOREIGN KEY(veiculoId) REFERENCES veiculos(id)
    )
  `);
});

app.get("/", (req, res) => {
  res.send("Sistema de Expedicao funcionando!");
});


// ===================== FUNCIONARIOS =====================

app.post("/funcionarios", (req, res) => {
  const { nome, email } = req.body;

  db.run(
    "INSERT INTO funcionarios (nome, email) VALUES (?, ?)",
    [nome, email],
    function (err) {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        id: this.lastID,
        nome,
        email
      });
    }
  );
});

app.get("/funcionarios", (req, res) => {
  db.all("SELECT * FROM funcionarios", [], (err, rows) => {
    if (err) return res.status(500).json(err);

    res.json(rows);
  });
});

app.get("/funcionarios/:id", (req, res) => {
  db.get(
    "SELECT * FROM funcionarios WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json(err);

      if (!row)
        return res.status(404).json({ mensagem: "Funcionario nao encontrado" });

      res.json(row);
    }
  );
});

app.put("/funcionarios/:id", (req, res) => {
  const { nome, email } = req.body;

  db.run(
    "UPDATE funcionarios SET nome=?, email=? WHERE id=?",
    [nome, email, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({ mensagem: "Funcionario atualizado" });
    }
  );
});

app.delete("/funcionarios/:id", (req, res) => {
  db.run(
    "DELETE FROM funcionarios WHERE id=?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.status(204).send();
    }
  );
});


// ===================== PEDIDOS =====================

app.post("/pedidos", (req, res) => {
  const { cliente, endereco, funcionarioId } = req.body;

  db.run(
    "INSERT INTO pedidos (cliente, endereco, funcionarioId) VALUES (?, ?, ?)",
    [cliente, endereco, funcionarioId],
    function (err) {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        id: this.lastID,
        cliente,
        endereco,
        funcionarioId
      });
    }
  );
});

app.get("/pedidos", (req, res) => {
  db.all("SELECT * FROM pedidos", [], (err, rows) => {
    res.json(rows);
  });
});


// ===================== VEICULOS =====================

app.post("/veiculos", (req, res) => {
  const { placa, modelo } = req.body;

  db.run(
    "INSERT INTO veiculos (placa, modelo) VALUES (?, ?)",
    [placa, modelo],
    function (err) {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        id: this.lastID,
        placa,
        modelo
      });
    }
  );
});

app.get("/veiculos", (req, res) => {
  db.all("SELECT * FROM veiculos", [], (err, rows) => {
    res.json(rows);
  });
});


// ===================== EXPEDICOES =====================

app.post("/expedicoes", (req, res) => {
  const { pedidoId, veiculoId } = req.body;

  db.run(
    "INSERT INTO expedicoes (pedidoId, veiculoId) VALUES (?, ?)",
    [pedidoId, veiculoId],
    function (err) {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        id: this.lastID,
        pedidoId,
        veiculoId
      });
    }
  );
});

app.get("/expedicoes", (req, res) => {
  db.all("SELECT * FROM expedicoes", [], (err, rows) => {
    res.json(rows);
  });
});


// ===================== RELACIONAMENTOS =====================

// pedidos de um funcionario

app.get("/funcionarios/:id/pedidos", (req, res) => {

  db.all(
    "SELECT * FROM pedidos WHERE funcionarioId=?",
    [req.params.id],
    (err, rows) => {
      res.json(rows);
    }
  );

});

// veiculos de um pedido

app.get("/pedidos/:id/veiculos", (req, res) => {

  db.all(`
    SELECT v.*
    FROM veiculos v
    JOIN expedicoes e ON v.id = e.veiculoId
    WHERE e.pedidoId = ?
  `,
  [req.params.id],
  (err, rows) => {
    res.json(rows);
  });

});

// pedidos de um veiculo

app.get("/veiculos/:id/pedidos", (req, res) => {

  db.all(`
    SELECT p.*
    FROM pedidos p
    JOIN expedicoes e ON p.id = e.pedidoId
    WHERE e.veiculoId = ?
  `,
  [req.params.id],
  (err, rows) => {
    res.json(rows);
  });

});

app.get("/pedidos/:id", (req, res) => {
  db.get(
    "SELECT * FROM pedidos WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json(err);

      if (!row)
        return res.status(404).json({ mensagem: "Pedido nao encontrado" });

      res.json(row);
    }
  );
});

app.put("/pedidos/:id", (req, res) => {
  const { cliente, endereco, funcionarioId } = req.body;

  db.run(
    "UPDATE pedidos SET cliente=?, endereco=?, funcionarioId=? WHERE id=?",
    [cliente, endereco, funcionarioId, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({ mensagem: "Pedido atualizado" });
    }
  );
});

app.delete("/pedidos/:id", (req, res) => {
  db.run(
    "DELETE FROM pedidos WHERE id=?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.status(204).send();
    }
  );
});

app.get("/veiculos/:id", (req, res) => {
  db.get(
    "SELECT * FROM veiculos WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json(err);

      if (!row)
        return res.status(404).json({ mensagem: "Veiculo nao encontrado" });

      res.json(row);
    }
  );
});

app.put("/veiculos/:id", (req, res) => {
  const { placa, modelo } = req.body;

  db.run(
    "UPDATE veiculos SET placa=?, modelo=? WHERE id=?",
    [placa, modelo, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({ mensagem: "Veiculo atualizado" });
    }
  );
});

app.delete("/veiculos/:id", (req, res) => {
  db.run(
    "DELETE FROM veiculos WHERE id=?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.status(204).send();
    }
  );
});

app.get("/expedicoes/:id", (req, res) => {
  db.get(
    "SELECT * FROM expedicoes WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json(err);

      if (!row)
        return res.status(404).json({ mensagem: "Expedicao nao encontrada" });

      res.json(row);
    }
  );
});

app.put("/expedicoes/:id", (req, res) => {
  const { pedidoId, veiculoId } = req.body;

  db.run(
    "UPDATE expedicoes SET pedidoId=?, veiculoId=? WHERE id=?",
    [pedidoId, veiculoId, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({ mensagem: "Expedicao atualizada" });
    }
  );
});

app.delete("/expedicoes/:id", (req, res) => {
  db.run(
    "DELETE FROM expedicoes WHERE id=?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.status(204).send();
    }
  );
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;