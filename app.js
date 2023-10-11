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
const Contato = mongoose.model('Contatos', {
  nome: String,
  telefone: String,
});

// Use o bodyParser para analisar o corpo das solicitações
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rota para criar um novo contato
app.post('/contatos/adicionar', async (req, res) => {
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
app.delete('/contatos/remover/:id', async (req, res) => {
  try {
    const contatoId = req.params.id;

    const resultado = await Contato.findOneAndRemove ({ _id: contatoId });

    if (!resultado) {
      return res.status(404).json({ mensagem: 'Contato não encontrado.'});
    }

    res.json({ menssage: `contato com ID ${contatoId} removido com sucesso` });
  } catch (error) {
    console.error(error); 
      return res.status(500).json({ erro: 'Erro ao remover o contato.'});
  }
})


app.get('/contatos/listar', async (req, res) => {
  try {
    const contatos = await Contato.find();
    res.json(contatos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar contatos.' });
  }
});


// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});