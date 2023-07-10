import React, { useState, useEffect, useContext } from 'react';
import SideMenu from '../../components/SideMenu';

import './Admin.css' 

import Row from 'react-bootstrap/esm/Row';
import Order from '../../components/Order';
import Col from 'react-bootstrap/Col';
import OrderSlide from '../../components/OrderSlide';
import { useFetchCRUD } from '../../hooks/useFetchCRUD';
import { RoutesContext } from '../../context/RoutesContext';
import { RoleContext } from '../../context/RoleContext';


const Admin = () => {
  const {urls} = useContext(RoutesContext);
  const { token } = useContext(RoleContext);
  const { data: products } = useFetchCRUD(`${urls.product}`);
  const { data: ordersFetch } = useFetchCRUD(`${urls.table}find-new-orders/`, token);

  const [orders, setOrders] = useState([])

  useEffect(() => {
    if(ordersFetch){
      setOrders(ordersFetch);
    }
  }, [ordersFetch]);
  
  const [ordersNotSlider, setOrdersNotSlider] = useState(orders.slice(0, 7));

  useEffect(() => {
    setOrdersNotSlider(orders.slice(0,7));
  }, [orders]);

  const atualizarPedidos = async () => {
    const res = await fetch(`${urls.table}find-new-orders/find-all`, {method: "GET", headers:{"Authorization":`Bearer ${token}`}});
    const json = await res.json();
    setOrders(json);
  }

  return (
    <div className='pedidos-admin d-flex'>
      <SideMenu page='pedidos'/>

      <aside className='pedidos-container d-flex flex-column'>
        <button className='atualizar' onClick={atualizarPedidos}>Atualizar</button>
        <Row className='d-flex w-100 mt-5 mt-md-0'>
          {ordersNotSlider && ordersNotSlider.map((order) => (<Col 
                                    className='col-12 col-md-6 col-lg-3 mb-3'
                                    key={order.id}>
                                    <Order order={order} products={products} setOrders={setOrders} />
                                  </Col>))}
    
            {orders.length > 7 && (<Col className='col-12 col-md-6 col-lg-3 mb-3'><OrderSlide orders={orders}/></Col>)}    
          </Row>
      </aside>
    </div>
  )
}

export default Admin