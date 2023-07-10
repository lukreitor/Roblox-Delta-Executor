import React, { useContext, useEffect, useState } from 'react';

import './Attendant.css';

import NavBarHome from '../../components/NavBarHome';
import Container from 'react-bootstrap/esm/Container';
import { RoutesContext } from '../../context/RoutesContext';
import { RoleContext } from '../../context/RoleContext';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import AttendantCard from '../../components/AttendantCard';

const Attendant = () => {
  const { urls } = useContext(RoutesContext);
  const { token } = useContext(RoleContext);
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchTables = async () => {
      let res = await fetch(`${urls.user}find-all`, {method:"GET", headers:{"Authorization":`Bearer ${token}`}})
      let users = await res.json();
  
      setTables(users.filter(user => user.userRole === "TABLE_ROLE"));
    }
    
    fetchTables();
  }, [token, urls.user]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${urls.product}/find-all`);

      const json = await res.json();
      
      setProducts(json);
    }

    fetchProducts();
  }, [urls.product]);
  
  return (
    <div className='attendant-painel'>
      <NavBarHome><h1>Finalizar pedidos</h1></NavBarHome>
      <Container>
        <div className='attendant-board'>
          <Row className='w-100 h-100 d-flex'>
              {tables !== [] && tables.map(table => <Col key={table.id} className='col-12 col-md-6 col-lg-3 mb-3'>
                <AttendantCard table={table} products={products}/>
              </Col>)}
            </Row>
        </div>
      </Container>
    </div>
  )
}

export default Attendant