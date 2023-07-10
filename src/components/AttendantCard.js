import React, { useContext, useEffect, useState } from 'react'

import './AttendantCard.css';

import Modal from 'react-bootstrap/Modal';
import { RoutesContext } from '../context/RoutesContext';
import { RoleContext } from '../context/RoleContext';
import { ExclamationCircle } from 'react-bootstrap-icons';
import CpfComponent from '../components/CpfComponent';

const AttendantCard = ({ table, products }) => {
    const { urls } = useContext(RoutesContext);
    const { token } = useContext(RoleContext);

    const [show, setShow] = useState(false);
    const [modalType, setModalType] = useState('');

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await fetch(`${urls.table}find-table-orders/find-all`, {method: "POST", headers:{"Content-Type":"application/json", "Authorization":`Bearer ${token}`}, body:JSON.stringify({ id: table.id })});

            const json = await res.json();

            setOrders(json.filter((o) => o.status !== "PAID_OUT"));
        }

        fetchOrders();
    }, [table.id, token, urls]);

    const handleClose = () => {
        setShow(false);

    }

  return (
    <>
        <div className='attendant-component'>
            <div className="card-header">
                Mesa {table.username}
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
                <div className='d-flex align-items-center justify-content-center text-container'>
                    <ExclamationCircle size={32} color='#202020'/>
                    <h5 className='mb-0 mt-0'>{orders.length} pedidos em aberto!</h5>
                </div>
            </div>
            <div className="card-footer">
                <button onClick={() => {setModalType('finishOrder');setShow(true);}} disabled={orders.length === 0 ? true:false}>Finalizar pedido</button>
            </div>
        </div>

        <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title>
                  {modalType === 'finishOrder' && <>Finalizar pedido - Mesa {table.username}</>}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
                {modalType === 'finishOrder' && (
                    <div className='orders-cpf-container'>
                        <div className="orders-cpf-content">
                            {orders && orders.map((order) => 
                                <CpfComponent key={order.id} order={order} products={products} setOrders={setOrders}/>)}
                        </div>
                    </div>
                )}
          </Modal.Body>
          <Modal.Footer>
            {modalType === 'payOrder' && <button className='editar'>Finalizar pagamento</button>}
            <button className='close' onClick={handleClose}>Cancelar</button>
          </Modal.Footer>
        </Modal>
    </>

  )
}

export default AttendantCard