import '../styles/Machine.css';
import { useEffect, useState } from 'react';
import n5 from '../assets/n5.jpg';
import n2 from '../assets/n2.jpg';
import m1 from '../assets/m1.png';
import m50c from '../assets/m50c.png';
import m25c from '../assets/m25c.png';
import m10c from '../assets/m10c.png';
import m5c from '../assets/m5c.png';
import m1c from '../assets/m1c.png';

function Machine({ itens, credito, selectItem, depositar, troco, comprar, children }) {
  const [selectedItem, setSelectedItem] = useState();
  const [cred, setCred] = useState(0);
  const [deposito, setDeposito] = useState(
    {
      n5: 0,
      n2: 0,
      m1: 0,
      m50c: 0,
      m25c: 0,
      m10c: 0,
      m5c: 0,
      m1c: 0
    }
  );

  // useEffect(() => {
  //   setCred(credito);
  // }, [])



  function handleSelectedItem(item) {    
    selectItem(item);
    setSelectedItem(item.id);
    console.log(selectedItem);
  }

  function updateCredito(money) {
    setDeposito(prevDeposito => ({...prevDeposito, [money]: prevDeposito[money]++}));
    depositar(deposito, credito);
  }

  useEffect(() => {
    depositar(deposito);
  }, [deposito])

  return (
    <>
      <div id="machine">
        <ul>
          {itens.map(item => <li key={item.id}>{item.id}<button class="btnSelect" onClick={() => handleSelectedItem(item)}><p></p></button><p class="preco">R${item.preco}</p></li>)}
        </ul>

        <div id="infos">
          <h3>Item selecionado: <span> {selectedItem}</span></h3>
          <h3>Crédito disponível: R$<span>{credito}</span></h3>
        </div>
        <div id="compra">
          <p>Deposite seu dinheiro</p>
          <ul>
            <li onClick={() => updateCredito('n5')}><img src={n5} width="75px" /></li>
            <li onClick={() => updateCredito('n2')}><img src={n2} width="75px" /></li>
            <li onClick={() => updateCredito('m1')}><img src={m1} width="50px" /></li>
            <li onClick={() => updateCredito('m50c')}><img src={m50c} width="50px" /></li>
            <li onClick={() => updateCredito('m25c')}><img src={m25c} width="50px" /></li>
            <li onClick={() => updateCredito('m10c')}><img src={m10c} width="55px" /></li>
            <li onClick={() => updateCredito('m5c')}><img src={m5c} width="40px" /></li>
            <li onClick={() => updateCredito('m1c')}><img src={m1c} width="45px" /></li>
          </ul>
        </div>
        <div id="efetuarCompra">
          <h3>Troco: R$ {troco}</h3>
          <button onClick={() => comprar(selectedItem)}>Comprar</button>
        </div>
      </div>
    </>

  )
}

export default Machine;