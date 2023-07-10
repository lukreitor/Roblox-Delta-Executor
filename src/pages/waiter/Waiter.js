import React, { useContext } from 'react';

import './Waiter.css';

import NavBarHome from '../../components/NavBarHome';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from '../../components/Table';

import { useFetchCRUD } from '../../hooks/useFetchCRUD';
import { RoutesContext } from '../../context/RoutesContext';
import { RoleContext } from '../../context/RoleContext';

const Waiter = () => {
    const { token } = useContext(RoleContext);
    const { urls } = useContext(RoutesContext);
    const { data: users } = useFetchCRUD(urls.user, token);

    const tables = users.filter(user => user.userRole === 'TABLE_ROLE');

  return (
    <div className='waiter'>
      <NavBarHome><h1>Mesas</h1></NavBarHome>
      <div className='table-container'>
        <Row className='d-flex justify-content-center align-items-center w-100'>
                {tables && tables.map((table) => (
                                <Col className='col-12 col-md-4 col-lg-2 mb-3'
                                     key={table.id}>
                                    <Table table={table}/>
                                </Col>
                ))}
            </Row>
      </div>
    </div>
  )
}

export default Waiter