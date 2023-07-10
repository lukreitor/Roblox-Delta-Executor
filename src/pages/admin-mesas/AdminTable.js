import React, { useState, useContext, useEffect } from 'react';

import './AdminTable.css';

import SideMenu from '../../components/SideMenu';
import Table from '../../components/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useFetchCRUD } from '../../hooks/useFetchCRUD';
import { RoutesContext } from '../../context/RoutesContext';
import { RoleContext } from '../../context/RoleContext';
import { Plus } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';

const AdminTable = () => {
    const { urls } = useContext(RoutesContext);
    const { token } = useContext(RoleContext);
    const { data: users, loading, httpConfig } = useFetchCRUD(urls.user, token);

    const [tables, setTables] = useState([]);
    const [show, setShow] = useState(false)
    const [numMesa, setNumMesa] = useState('');

    useEffect(() => {
      setTables(users.filter((user) => user.userRole === "TABLE_ROLE"));
    }, [users]);

    const handleClose = () => {
      setShow(false);
    }

    const handleShow = () => {
      setShow(true);
    }

    const handleSubmit = () => {
      if(numMesa.length > 1 && !isNaN(numMesa)){
        let newTable = ({
          "id": null,
          "username": numMesa,
          "password": "jkzxcv",
          "userRole":"TABLE_ROLE",
          "name": null,
          "cpf":null,
          "salary":null
        })
        
        httpConfig(newTable, "CREATE");

        handleClose();
      } else {
        alert('Número da mesa deve ser preenchido e ser composto apenas de números!');
      }
    }

  return (
    <div className='admin-table'>
        <SideMenu page='mesas'/>
        <aside className='admin-table-board'>
            <Row className='d-flex w-100 h-100'>
                {!loading && tables && tables.map((table) => (
                                <Col className='col-12 col-md-6 col-lg-3 mb-3'
                                     key={table.id}>
                                    <Table table={table} tables={tables} setTables={setTables}/>
                                </Col>
                ))}

                {loading && (<div className='loading-container'>
                                <div className='loading'></div>
                            </div>)}
            </Row>
        </aside>
        <div className="add-button" onClick={handleShow}>
          <Plus size={36} color={'#fff'}/>
        </div>

        <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title>
                  Criar mesa
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className='modalInput d-flex flex-column'>
              <label htmlFor='numMesa' className='text-black mb-2'>Número da mesa</label>
              <input type="text" 
                  name='numMesa'
                  className={numMesa.length > 1 && !isNaN(numMesa) ? 'form-component valid' : 'form-component invalid'}
                  value={numMesa} 
                  onChange={(e) => setNumMesa(e.target.value)}/>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button className='criar-mesa' onClick={handleSubmit}>Criar mesa</button>
            <button className='close' onClick={handleClose}>Fechar</button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default AdminTable