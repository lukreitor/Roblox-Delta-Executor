import React, { useContext, useState } from 'react';

import Modal from 'react-bootstrap/Modal';
import { RoleContext } from '../context/RoleContext';
import { RoutesContext } from '../context/RoutesContext';

import './CpfComponent.css';

const CpfComponent = ({ order, products, setOrders }) => {
    const [show, setShow] = useState(false);

    const [paymentOption, setPaymentOption] = useState('');

    const { urls } = useContext(RoutesContext);
    const { token } = useContext(RoleContext);

    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setShow(false);
    }

    const ids = [...order.idProductOrder, ...order.newIdProductOrder];

    const productsOrder = [];

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

    const payOrder = async () => {
        setLoading(true);
        try{
            await fetch(`${urls.table}payorder`, {method: "POST", headers:{"Content-Type":'application/json', "Authorization":`Bearer ${token}`}, body:JSON.stringify({id: order.id, paymentMethod: paymentOption})});

            setOrders(prevState => prevState.filter(o => o.id !== order.id));
            
            handleClose();
        }
        catch(error){
            console.log(error.message);
        }
        setLoading(false);
    }

  return (
    <>
        <button onClick={() => setShow(true)} className='d-flex justify-content-between align-items-center order-container w-100'>
            <h4>{order.cpfCliente}</h4>
            <h4>R$ {order.totalValue}</h4>
        </button>

        <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title>
                Realizar pagamento
                <h5>{order.cpfCliente}</h5>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <div className='products-list'>
                    <div className='products-content'>
                        {productsOrder && productsOrder.map((product) => (
                            <div  key={product.id} className='d-flex justify-content-between align-items-center data-container'>
                                <div>
                                    <p className='mb-0'>{product.name}</p>
                                </div>
                                <div>
                                    <p className='mb-0 qtd'>{product.qtd}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="payment-method mt-3">
                    <select class="form-select" aria-label="Default select example" onChange={(e) => setPaymentOption(e.target.value)}>
                        <option selected>Selecionar forma de pagamento</option>
                        <option value="PIX">Pix</option>
                        <option value="CASH">Dinheiro</option>
                        <option value="CREDIT_CARD">Crédito</option>
                        <option value="DEBIT_CARD">Débito</option>
                    </select>
                </div>
          </Modal.Body>
          <Modal.Footer>
            <button className='editar' onClick={payOrder} disabled={paymentOption === '' | loading}>Finalizar pagamento</button>
            <button className='close' onClick={handleClose}>Cancelar</button>
          </Modal.Footer>
        </Modal>
    </>

  )
}

export default CpfComponent