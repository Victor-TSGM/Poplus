import './App.css';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Machine from './components/Machine';

import api from './services/api';

function App() {
  const [itens, setItens] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [credito, setCredito] = useState();
  const [deposito, setDeposito] = useState({});
  // const [caixa, setCaixa] = useState([]);
  const [troco, setTroco] = useState(0);

  useEffect(() => {
    api.get('/refrigerantes').then(response => {
      setItens(response.data);
    })
  }, []);

  useEffect(() => {
    api.get('/credito').then(response => {
      setCredito(response.data.toFixed(2));
    })
  }, [credito]);

  useEffect(() => {
    setTroco(troco)
  }, [troco]);

  function handleSelectedItem(item) {
    setSelectedItem(item.id);
    console.log(selectedItem);
  } 

  function handleInsertMoney(money, cred) {
    api.post('/depositar', money).then(response => {
      setDeposito(response.data);
      setCredito(cred);
    }).catch(error => {
      alert("Erro ao depositar")
    })
  }

  async function efetuaCompra(item) {
    var mensagemTroco = "Distribuição do troco: ";

    await api.post('/comprar', {id: item}).then(response => {
      const result = response.data;
      setTroco(result.valorTroco);
      setCredito(result.credito);

      const trocoInfo = result.troco;
      trocoInfo.map(index => {
        mensagemTroco += `${index.id}: ${index.qtd}` + " ";
      });

      alert(mensagemTroco);
    }).catch(error => {
      alert('erro ao comprar', error);
    })
  }



  return (
    <>
    <Header title="Maquina PoPlus"/>
    <Machine 
      itens={itens} 
      selectItem={handleSelectedItem}
      credito={credito}
      depositar={handleInsertMoney}
      troco={troco}
      comprar= {efetuaCompra}
      />
    </>
    
  );
}

export default App;
