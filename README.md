# Sistema de Expedição - Projeto N3

Este projeto é uma solução acadêmica desenvolvida para a disciplina de Software Engineering. O sistema gerencia fluxos de expedição, permitindo o cadastro de funcionários, pedidos e veículos, com suporte a relacionamentos entre essas entidades.

## 🚀 Tecnologias Utilizadas
- **Back-end:** Node.js, Express, SQLite3.
- **Front-end:** HTML5, CSS3, JavaScript (Vanilla).
- **Testes:** Jest & Supertest.
- **CI/CD:** GitHub Actions.

## 📋 Pré-requisitos
Certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (Versão 18+)
- [Git](https://git-scm.com/)

## ⚙️ Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone [https://github.com/RenanGPie/AvalicaoRestFul.git](https://github.com/RenanGPie/AvalicaoRestFul.git)
cd AvalicaoRestFul

2. Rodar o Back-end
Bash
cd backend-final
npm install
node server.js
A API estará rodando em: http://localhost:3000

3. Rodar o Front-end
Abra um novo terminal na raiz do projeto:

Bash
cd frontend
npx serve .
Acesse o sistema através do endereço exibido no terminal.

🧪 Testes Automatizados
Para verificar a integridade da API, rode os testes na pasta do back-end:

Bash
cd backend-final
npx jest
🛠️ Arquitetura de Dados
O sistema utiliza um modelo de relacionamento Many-to-Many:

Funcionários: 1:N Pedidos

Pedidos N:N Veículos: Intermediado pela entidade Expedições.

🚀 CI/CD
O projeto possui integração contínua configurada via GitHub Actions:

Backend CI: Executa automaticamente todos os testes unitários a cada push/pull request.

Frontend CI: Valida o build da interface.

Desenvolvido por Renan Gabriel Piechontcoski
