const express = require('express');

const { getAllData, insertUser, deleteUser, getById, deleteFirstElement,
  getNext, getSize, getNames, resetTable, getAllDataByBranch, getNamesByCategory, getNextByCategory, getSizeByCategory, deleteByCategory } = require('./services/main.js');

const removeInit = require('./services/removeInit');

const santosRouter = express.Router();
const thisBranch = 'santos';

santosRouter.get('/', (request, response) => {
  return response.redirect('https://turnapp.vercel.app/jogos.html')
})

// Método insert
santosRouter.post('/fila', async (request, response) => {
  let { name, game, category, branch } = request.body;
  let url = 'https://turnapp.vercel.app/jogos.html';
  
  if (game === 'fifa' || game === 'tlou' || game === 'sfv' || game === 'beatsaber') {
    category = 'playstation';
  } else if (game === 'rpg' || game === 'war') {
    category = 'board';
  } else {
    category = null;
  }

  try {       
    await insertUser(name, game, category, branch);
    removeInit();
    return response.redirect(url);  

  } catch (error) {
    return response.status(400).send(`Erro ao entrar na fila. Tente novamente. ${error}`);
  }
});

santosRouter.get('/fila', async (request, response) => {
  const data = await getAllDataByBranch(thisBranch);

  if (data.length > 0) {
    try {    
      await data;
      return response.json(data);   
  
    } catch (error) {
      return response.status(503).send(`Sem resposta do servidor. Tente novamente. ${error}`);
    }
  } else {
    return response.status(404).json({ message: "Error"})
  }
})

// Retorna o item da fila pelo ID
santosRouter.get('/fila/id/:id', async (request, response) => { 
  const params = request.params;
  const data = await getById(params.id);

  if (data) {
    return response.json(data);
  } else {
    return response.status(404).send("ID não encontrado") 
  }  
});

// Retorna items da fila por categoria
santosRouter.get('/fila/category/:category', async (request, response) => { 
  const params = request.params;

  const data = await getNamesByCategory(params.category, thisBranch);
  if (data.length > 0) {
    return response.json(data)
  } else {
    return response.status(404).send(`Não há filas para a categoria "${params.game}".`)
  }
});

// retorna todos os itens por jogo
santosRouter.get('/fila/names/:game', async (request, response) => { 
  const params = request.params;

  const data = await getNames(params.game, thisBranch);
  if (data.length > 0) {
    return response.json(data)
  } else {
    return response.status(404).send(`Não há filas para o jogo "${params.game}".`)
  }
});

// Retorna o próximo da fila por jogo
santosRouter.get('/fila/next/:game', async (request, response) => { 
  const params = request.params;
  const data = await getNext(params.game, thisBranch);

  return response.json({message: `Usuário ${data.name} é o próximo da fila`});
});

// Retorna o próximo da fila por categoria
santosRouter.get('/fila/next/category/:category', async (request, response) => { 
  const params = request.params;
  const data = await getNextByCategory(params.category, thisBranch);

  return response.json({message: `${data.name} é o próximo a jogar`});
});

santosRouter.get('/fila/size/:game', async (request, response) => { 
  const params = request.params;
  const data = await getSize(params.game, thisBranch);

  return response.json(data.playersCount);
});

santosRouter.get('/fila/size/category/:category', async (request, response) => { 
  const params = request.params;
  const data = await getSizeByCategory(params.category, thisBranch);

  return response.json({message: `Existem ${data.playersCount} usuários na fila`});
});

// Métodos delete
santosRouter.delete('/fila/:game', async (request, response) => {
  const params = request.params;
  const data = await getNext(params.game, thisBranch);

  try {
    await deleteFirstElement(params.game, thisBranch);
    console.log(`${data.name} removido da fila do jogo ${params.game}`)
    
  } catch (error) {
    return response.status(404).send(`Não há mais jogadores na fila de "${params.game}".`)
  }
})

santosRouter.delete('/fila/category/:category', async (request, response) => {
  const params = request.params;
  const data = await getNextByCategory(params.category, thisBranch);

  try {
    await deleteByCategory(params.category, thisBranch);
    console.log(`${data.name} removido da categoria ${params.category}`)
    
  } catch (error) {
    return response.status(404).send(`Não há mais jogadores na fila de "${params.game}".`)
  }
})

santosRouter.delete('/delete/:id', async (request, response) => {
  const params = request.params;
  const userData = await getById(params.id);

  try {
    await deleteUser(params.id).then(data => data);
    response.json({message: `Usuário ${userData.name} removido da fila ${params.game} da unidade ${thisBranch}`});
    
  } catch (error) {
    return response.status(404).send(`Usuário não encontrado.`)
  }
})



santosRouter.delete('/reset', async (request, response) => {
  const reset = await resetTable();
  return response.send(reset);
});

module.exports = santosRouter;
