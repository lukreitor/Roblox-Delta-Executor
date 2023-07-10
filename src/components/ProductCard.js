import React, {useContext} from 'react'
import { OrderContext } from '../context/OrderContext'
import './ProductCard.css'

const ProductCard = ({id, photo, name, price, description, ingredients}) => {
    const {order, setOrder, total, setTotal} = useContext(OrderContext);

    const handleClick = () => {
        const newOrder = [...order];
        const orderIndex = order.findIndex(order => order.id === id);
        
        if(orderIndex !== -1){
            newOrder[orderIndex].qtd++;
            setOrder(newOrder);
        } else {
            setOrder(prevOrder => [...prevOrder, { id, image: photo, name, price, description, ingredients, qtd: 1}]);
        }
        setTotal(total + price);
    }

  return (
    <div className='product-card h-100 d-flex flex-column justify-content-between'>
        <div className='d-flex justify-content-center align-items-center card-top'>
            <img src={photo} alt={`Imagem ilustrativa de ${name}`} />
        </div>
        <div className='card-data d-flex flex-column justify-content-between h-75'>
            <div className='card-title d-flex justify-content-between align-items-start'>
                <h2>{name}</h2>
                <h2>R${price}</h2>
            </div>
            <p className='card-desc'>{description}</p>
            <div className='card-ing-car d-flex justify-content-between align-items-end'>
                <div className='ingredients col-6'>
                    <p>{ingredients.map((ingredient => {if(ingredients.indexOf(ingredient) === ingredients.length - 1){
                       return `${ingredient}`
                    } else {
                       return `${ingredient} - `
                    }}))}</p>
                </div>
                <button onClick={handleClick}>Carrinho</button>
            </div>
            <button className='col-12 btn-order' onClick={handleClick}>Efetuar pedido</button>
        </div>
    </div>
  )
}

export default ProductCard