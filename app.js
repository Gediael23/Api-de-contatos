const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Conecte-se ao MongoDB
mongoose.connect('mongodb://127.0.0.1:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Defina o modelo do MongoDB
const Contato = mongoose.model('Contato', {
  nome: String,
  telefone: String,
});

// Use o bodyParser para analisar o corpo das solicitações
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rota para criar um novo contato
app.post('/adicionar-contato', async (req, res) => {
  try {
    const { nome, telefone } = req.body;

    // Crie um novo objeto Contato
    const novoContato = new Contato({ nome, telefone });

    // Salve o objeto no MongoDB
    await novoContato.save();

    return res.status(201).json({ mensagem: 'Contato adicionado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao adicionar contato.' });
  }
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});