import React, {useContext} from 'react';
import './CarCard.css';

import { OrderContext } from '../context/OrderContext';
import { Trash } from 'react-bootstrap-icons';

const CarCard = ({id, photo, name, price, description, qtd }) => {
    const {order, setOrder, total, setTotal} = useContext(OrderContext);
    
    const handleClick = () => {
        const newOrder = [...order];
        const orderIndex = order.findIndex(order => order.id === id);

        newOrder[orderIndex].qtd--;

        if(newOrder[orderIndex].qtd === 0){
            newOrder.splice(newOrder[orderIndex], 1);
        }

        setOrder(newOrder);
        setTotal(total - price);
    }

    const handleClickAll = () => {
        const newOrder = [...order];
        const orderIndex = order.findIndex(order => order.id === id);

        setTotal(total - newOrder[orderIndex].qtd * price);

        newOrder.splice(newOrder[orderIndex], 1);
        setOrder(newOrder);
    }

  return (
    <div className='d-flex justify-content-between align-items-center car-card'>
        <div className='img-bg col-3 d-flex justify-content-center align-items-center p-3'>
            <img src={photo} alt={`Imagem ilustrativa de ${name}`} />
        </div>
        <div className='d-flex flex-column justify-content-center col-7 p-3'>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>{qtd}x - {name}</h3>
                <h4>R$ {price * qtd}</h4>
            </div>
            <p>{description}</p>
        </div>
        <div className='buttons-container'>
            <button className='col-2' onClick={handleClick}>1x <Trash size={24} color='#E32929'/></button>
            {qtd > 1 && <button className='col-2' onClick={handleClickAll}>{qtd}x <Trash size={24} color='#E32929'/></button>}
        </div>
    </div>
  )
}

export default CarCard