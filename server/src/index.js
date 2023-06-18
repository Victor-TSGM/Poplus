const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const refrigerantes = [
  {
    id: 'coca',
    preco: 2.5,
    qtd: 50
  },
  {
    id: 'fanta',
    preco: 2.2,
    qtd: 40
  },
  {
    id: 'pepsi',
    preco: 2,
    qtd: 30
  }
];

const caixa = [
  {
    id: 'n5',
    valor: 5,
    tipo: 'nota',
    qtd: 0
  },
  {
    id: 'n2',
    valor: 2,
    tipo: 'nota',
    qtd: 0
  },
  {
    id: 'm1',
    valor: 1,
    tipo: 'moeda',
    qtd: 300
  },
  {
    id: 'm50c',
    valor: 0.50,
    tipo: 'moeda',
    qtd: 300
  },
  {
    id: 'm25c',
    valor: 0.25,
    tipo: 'moeda',
    qtd: 200
  },
  {
    id: 'm10c',
    valor: 0.10,
    tipo: 'moeda',
    qtd: 200
  },
  {
    id: 'm5c',
    valor: 0.05,
    tipo: 'moeda',
    qtd: 100
  },
  {
    id: 'm1c',
    valor: 0.01,
    tipo: 'moeda',
    qtd: 100
  },
];

let credito = 0;

//Função para calcular troco
function calculaTroco(valor, caixa) {
  const trocos = [
    {
      id: 'm1',
      valor: 1,
      qtd: 0
    },
    {
      id: 'm50c',
      valor: 0.50,
      qtd: 0
    },
    {
      id: 'm25c',
      valor: 0.25,
      qtd: 0
    },
    {
      id: 'm10c',
      valor: 0.10,
      qtd: 0
    },
    {
      id: 'm5c',
      valor: 0.05,
      qtd: 0
    },
    {
      id: 'm1c',
      valor: 0.01,
      qtd: 0
    },
  ]

  for (let troco of trocos) {
    const caixaIndex = caixa.findIndex(caixa => caixa.valor === troco.valor);

    while(valor >= troco.valor){
      //Verifica se a quantidade de moedas disponíveis na maquina é suficiente
      if (caixa[caixaIndex].qtd > 0) {
        troco.qtd++
        caixa[caixaIndex].qtd--;
        valor = (valor - troco.valor).toFixed(2);
      }
    }
  }
  credito = 0;
  return trocos;
}

//Função que retorna os refrigerantes
app.get('/refrigerantes', (request, response) => {
  return response.json(refrigerantes);
});

//Funçao que retorna as moedas disponíveis no caixa
app.get('/caixa', (request, response) => {
  return response.json(caixa);
});

//Função para depositar credito a maquina
app.post('/depositar', (request, response) => {
  const { n5, n2, m1, m50c, m25c, m10c, m5c, m1c } = request.body;
  let valorDep = (n5 * 5) + (n2 * 2) + (m1 * 1) + (m50c * 0.50) + (m25c * 0.25) + (m10c * 0.10) + (m5c * 0.05) + (m1c * 0.01);
  credito += valorDep;

  caixa.forEach(index => {
    switch (index.id) {
      case 'm1':
        index.qtd += m1;
        break;
      case 'm50c':
        index.qtd += m50c;
        break;
      case 'm25c':
        index.qtd += m25c;
        break;
      case 'm10c':
        index.qtd += m10c;
        break;
      case 'm5c':
        index.qtd += m5c;
        break;
      case 'm1c':
        index.qtd += m1c;
        break;
    }

  });

  return response.json({credito: credito, valor: valorDep});
});

//Função para mostrar credito disponível
app.get('/credito', (request, response) => {
  return response.json(credito)
});

//Função para comprar refrigerante
app.post('/comprar', (request, response) => {
  const { id } = request.body;
  //Verificar o index do refrigerante escolhido
  const indexRefri = refrigerantes.findIndex(refrigerante => refrigerante.id === id);

  //Verifica se não existe o refrigerante selecionado
  if (indexRefri < 0) {
    return response.status(400).json({
      message: 'Refrigerante não disponível'
    })
  }

  //Verifica de o credito é suficiente e se tem quantidade de refrigerante
  if (credito < refrigerantes[indexRefri].preco || refrigerantes[indexRefri].qtd <= 0) {
    return response.status(400).json({
      message: 'Não é possível efetuar a compra'
    })
  }

  refrigerantes[indexRefri].qtd--;
  credito -= refrigerantes[indexRefri].preco;
  const ValorTroco = credito;
  const trocoInfo = calculaTroco(credito, caixa);


  return response.status(202).json({ message: 'Compra efetuaca com sucesso', valorTroco: ValorTroco, troco: trocoInfo, credito: credito })
});

app.listen(3333, () => {
  console.log('Server started');
});