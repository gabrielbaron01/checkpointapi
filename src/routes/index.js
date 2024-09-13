'use strict'

const express = require('express')
const router = new express.Router();
const mongoose = require('mongoose');
const produtoRoutes = require('../routes/produto-route');



const app = express();
const port = 3001;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao MongoDB');
}).catch((error) => {
  console.error('Erro ao conectar ao MongoDB', error);
});


app.use('/', produtoRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

router.get('/', (req, res, next) => {
    res.status(200).send({
        "nome": "Gabriel Baron",
        "nome": "Abner Aragon"
    });
});


router.get('/private', (req, res) => {
   
    const token = req.headers['authorization'];

    
    if (!token || token !== 'meuTokenSecreto') {
        
        return res.status(401).send('Unauthorized: token inválido');	
    }

    
    res.send('Area privada permitida!').sendStatus(200);
});

const tokensDatabase = {
    'tokenAdmin': { role: 'admin' },
    'tokenUser': { role: 'user' },
    'tokenGuest': { role: 'guest' },
};


router.get('/admin', (req, res) => {
    
    const token = req.headers['authorization'];

    
    if (!token) {
        return res.status(401).send('Unauthorized: token não fornecido');
    }

    const user = tokensDatabase[token];
    if (!user) {
        return res.status(401).send('Unauthorized: token inválido');
    }

  
    if (user.role !== 'admin') {
        return res.status(403).send('Forbidden: você não tem permissão para acessar esta área');
    }

    res.send('Welcome to the admin area!');
});



router.post('/submit', (req, res) => {
    const { username, email } = req.body;

    
    if (!username || !email) {
        return res.status(400).send('Favor preencher todos os campos: username e email.');
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Bad Request: Invalid email format');
    }

    
    res.send('Data submitted successfully').status(202);
});


const requestCounts = {};
const RATE_LIMIT = 5; 
const TIME_WINDOW = 60 * 1000; 


router.use((req, res, next) => {
    const ip = req.ip;

    if (!requestCounts[ip]) {
        requestCounts[ip] = { count: 1, firstRequest: Date.now() };
    } else {
        requestCounts[ip].count++;
    }

    const currentTime = Date.now();
    const timePassed = currentTime - requestCounts[ip].firstRequest;

    if (timePassed < TIME_WINDOW && requestCounts[ip].count > RATE_LIMIT) {
        return res.status(429).send('Too Many Requests: Please try again later.');
    }

    if (timePassed >= TIME_WINDOW) {
        requestCounts[ip].count = 1;
        requestCounts[ip].firstRequest = Date.now();
    }

    next();
});

// Rota de exemplo com rate limiting
router.get('/data', (req, res) => {
    res.send('Aqui estão seus dados!');
})

//Exemplo de erro 404 not found
//Documentação: https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4

let items = [
    { id: 0, name: 'item1' },
    { id: 1, name: 'item2' },
    { id: 2, name: 'item3' }
];

router.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);

    // Verificando se o itemId é um número válido
    if (isNaN(itemId)) {
        return res.status(400).send('Bad Request: Invalid ID format');
    }
    const item = items.find(item => item.id === itemId);

    if (item) {
        res.json(item);
    } else {
        // Se o item não existir, retornando 404 Not Found
        res.status(404).send('Item not found');
    }
});

//O status code 204 (No Content) é usado para indicar que a requisição foi processada com sucesso,
//mas não há conteúdo a ser retornado na resposta
router.put('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);
    const newName = req.body.name;

    // Verificando se o itemId é um número válido
    if (isNaN(itemId)) {
        return res.status(400).send('Bad Request: Invalid ID format');
    }

    // Buscando o índice do item no array
    const itemIndex = items.findIndex(item => item.id === itemId);

    // Verificando se o item existe
    if (itemIndex !== -1) {
        // Atualizando o item
        items[itemIndex].name = newName;
        // Retornando status 204 No Content
        return res.status(204).send();
    } else {
        // Se o item não existir, retornando 404 Not Found
        return res.status(404).send('Item not found');
    }
});

//outro exemplo de 204 - no content
router.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id, 10);

    // Verificando se o itemId é um número válido
    if (isNaN(itemId)) {
        return res.status(400).send('Bad Request: Invalid ID format');
    }

    // Buscando o índice do item no array
    const itemIndex = items.findIndex(item => item.id === itemId);

    // Verificando se o item existe
    if (itemIndex !== -1) {
        // Removendo o item
        items.splice(itemIndex, 1);
        // Retornando status 204 No Content
        return res.status(204).send();
    } else {
        // Se o item não existir, retornando 404 Not Found
        return res.status(404).send('Item not found');
    }
});

//Exemplo status 200
let nextId = 3;

// Rota para criar um novo item
//O status code 201 (Created) é usado para indicar que a requisição foi bem-sucedida 
//e que um novo recurso foi criado no servidor como resultado
router.post('/items', (req, res) => {
    const { name } = req.body;

    // Verificando se o nome foi fornecido
    if (!name) {
        return res.status(400).send('Bad Request: Name is required');
    }

    // Criando um novo item
    const newItem = { id: nextId++, name };

    // Adicionando o novo item ao "banco de dados"
    items.push(newItem);

    // Retornando status 201 Created com o novo item
    return res.status(201).json(newItem);
});

// Simulando uma fila de processamento
const processingQueue = [];

// Rota para aceitar uma nova requisição de processamento
router.post('/envio-whatsapp', (req, res) => {
    const { data } = req.body;

    // Verificando se os dados foram fornecidos
    if (!data) {
        return res.status(400).send('Bad Request: Data is required');
    }

    // Simulando a aceitação da requisição para processamento futuro
    const requestId = Date.now();
    processingQueue.push({ requestId, data });

    // Retornando status 202 Accepted com o ID da requisição
    return res.status(202).json({ requestId, message: 'Request accepted for processing' });
});

// Rota para obter o status de uma requisição de processamento
router.get('/envio-whatsapp/:requestId', (req, res) => {
    const requestId = parseInt(req.params.requestId, 10);

    // Verificando se o requestId é um número válido
    if (isNaN(requestId)) {
        return res.status(400).send('Bad Request: Invalid request ID format');
    }

    // Buscando a requisição na fila de processamento
    const request = processingQueue.find(req => req.requestId === requestId);

    if (request) {
        // Se a requisição existir, retornar o status 200 OK com os dados da requisição
        return res.status(200).json(request);
    } else {
        // Se a requisição não existir, retornar o status 404 Not Found
        return res.status(404).send('Request not found');
    }
});

module.exports = router;