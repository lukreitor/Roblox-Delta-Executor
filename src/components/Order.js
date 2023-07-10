import React, { useContext, useEffect, useState } from 'react'
import { RoleContext } from '../context/RoleContext';
import { RoutesContext } from '../context/RoutesContext';

import './Order.css'

const Order = ({ order, products, setOrders }) => {
    const ids = [...order.newIdProductOrder];
    const productsOrder = [];
    const { urls } = useContext(RoutesContext);
    const { token } = useContext(RoleContext);

    ids.forEach((id) => {
        for(const element of products){
            if(parseInt(id) === element.id && !productsOrder.includes(element)){
                element.qtd = 1;
                productsOrder.push(element);
            } else if (parseInt(id) === element.id && productsOrder.includes(element)){
                const index = productsOrder.findIndex((e) => e.id === parseInt(id));
                productsOrder[index].qtd++;
            }
        }
    })

    const date = new Date();
    let horaPedido = new Date(order.updatedAt).getTime() - 10800;
    horaPedido = horaPedido/1000;
    
    const [style, setStyle] = useState('');

    const [tempoPedidoFeito, setTempoPedidoFeito] = useState('');

    const funcTime = () => {
        const horaAtual = date.getTime()/1000; 
        if(horaAtual - horaPedido > 30 * 60){
            setStyle('normal');
        }

        if(horaAtual-horaPedido > 60 * 60){
            setStyle('urgente');
        }

        let subAtualPedido = horaAtual - horaPedido;
        let hora = Math.trunc(subAtualPedido / 3600);
        subAtualPedido = subAtualPedido - (hora * 3600);

        if(hora < 10){
            hora = `0${hora}`;
        }

        let minutos = Math.trunc(subAtualPedido / 60);

        if(minutos < 10){
            minutos = `0${minutos}`;
        }

        setTempoPedidoFeito(`${hora}:${minutos}`);
    }

    useEffect(() => {
        funcTime();
        const interval = setInterval(funcTime, 30000);

        return () => clearTimeout(interval);
    }, [])

    const finishOrder = async () => {
        await fetch(`${urls.table}finish-order/${order.id}`, {method: "GET", headers: {"Authorization": `Bearer ${token}`}})
        
        setOrders(prevState => prevState.filter(o => o.id !== order.id))
    }

  return (
    <div className={`order-component d-flex flex-column align-items center ${style}`}>
        <div className='w-100 d-flex justify-content-between align-items-center header p-3'>
            <h1 className='mb-0 mt-0'>Mesa {order.table_id.username}</h1>
            <h2 className='mb-0 mt-0'>{tempoPedidoFeito}</h2>
        </div>
        <div className='w-100 h-100 d-flex flex-column align-items-center justify-content-start body px-3 py-2'>
            <div className='d-flex flex-column justify-content-start w-100'>
                {productsOrder && productsOrder.map((product) => <h3 key={product.id}>{product.qtd}x {product.name}</h3>)}
            </div>
        </div>
        <div className='w-100 d-flex justify-content-end align-items-end footer p-2'>
            <button onClick={finishOrder}>Finalizar pedido</button>
        </div>
    </div>
  )
}

export default Order