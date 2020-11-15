const express = require('express');
const { getAllData, insertUser, deleteUser, getById, deleteFirstElement,
  getNext, getSize, getNames, resetTable, getAllDataByBranch } = require('./services/main.js');

const santosRouter = express.Router();
const thisBranch = 'santos';

santosRouter.get('/', (request, response) => {
  return response.send('Unidade de Santos')
})

// Método insert
santosRouter.post('/fila', (request, response) => {
  const { name, game, branch } = request.body;

  insertUser(name, game, branch);

  return response.json({message: `Usuário ${name} criado`});
});


// === Métodos get ===
// Retorna todos os itens da fila
// santosRouter.get('/fila', async (request, response) => {
//   const data = await getAllData().then(data => data);

//   response.json(data);
// });

santosRouter.get('/fila', async (request, response) => {
  const data = await getAllDataByBranch(thisBranch);

  response.json(data);
})

// Retorna o item da fila pelo ID
santosRouter.get('/fila/:id', async (request, response) => { 
  const params = request.params.id;

  const data = await getById(params);

  response.json(data);
});

// retorna todos os itens por jogo
santosRouter.get('/fila/names/:game', async (request, response) => { 
  const params = request.params;

  const data = await getNames(params.game, branch);

  return response.json(data)
  // console.log(params)
});

santosRouter.get('/fila/next/:game', async (request, response) => { 
  const params = request.params

  const data = await getNext(params.game, thisBranch);

  return response.json({message: `Usuário ${data.name} é o próximo da fila`});
});

santosRouter.get('/fila/size/:game', async (request, response) => { 
  const params = request.params;

  const data = await getSize(params.game, thisBranch);

  return response.json({message: `Existem ${data.playersCount} usuários na fila`});
});

// Métodos delete
santosRouter.delete('/fila/:game', async (request, response) => {
  const params = request.params;

  const data = await deleteFirstElement(params.game, thisBranch);

  response.json({message: `Usuário deletado da fila ${params.game} de ${thisBranch}`});
})

santosRouter.delete('/delete/:id',  (request, response) => {
  const params = request.params.id;

  const data = deleteUser(params).then(data => data);

  response.json(data);
})

santosRouter.delete('/reset', async (request, response) => {

  const reset = await resetTable();

  return response.send(reset);
});

module.exports = santosRouter;