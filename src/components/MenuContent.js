import React, { useContext, useEffect, useState } from 'react';
import { Pencil, Trash } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import { RoleContext } from '../context/RoleContext';
import { RoutesContext } from '../context/RoutesContext';
import { useFetchCRUD } from '../hooks/useFetchCRUD';
import InputText from '../components/InputText';

import './MenuContent.css';

const MenuContent = ({ productProp, setProductCardExhibition, active, products, setProducts }) => {
    const [show, setShow] = useState(false);

    const [product, setProduct] = useState(productProp);

    const [modalType, setModalType] = useState('');
    const { urls } = useContext(RoutesContext)
    const { loading, httpConfig } = useFetchCRUD(urls.product);
    const { data: categories } = useFetchCRUD(urls.category);
    const { token } = useContext(RoleContext);
    const [del, setDel] = useState(false);

    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [image, setImage] = useState(product.image ? product.image : '');
    const [price, setPrice] = useState(product.price);
    const [ingredients, setIngredients] = useState(product.ingredients.map(ingredient => ` ${ingredient}`));
    const [selectedCategory, setSelectedCategory] = useState(product.category.id);

    const handleOpenDel = () => {
        setModalType('del');
        setShow(true);
    }

    const handleOpenEdit = () => {
        setModalType('edit');
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
    }

    const delProduct = () => {
        httpConfig(product, 'DELETE', token);
        setDel(true);
        handleClose();
    }

    const editProduct = () => {
        const editedProduct = {
            category: categories.filter((category) => category.id === parseInt(selectedCategory))[0],
            name,
            price,
            image: image !== '' ? image : null,
            description,
            id: product.id,
            ingredients: ingredients,
        }

        httpConfig(editedProduct, "PUT", token);

        setProduct(editedProduct);
        setProductCardExhibition(editedProduct);

        handleClose();
    }

    useEffect(() => {
        if(del){
            setProducts(products.filter(p => p.id !== product.id))
            setProductCardExhibition(null);
            setDel(false);
        }
    }, [del, product.id, products, setProducts, setProductCardExhibition]);
  return (
    <>
        <button 
        className={active ? 'menu-content-component d-flex justify-content-between align-items-center activeComponent' : 'menu-content-component d-flex justify-content-between align-items-center'} 
        onClick={() => setProductCardExhibition(product)}>
            <div className='d-flex justify-content-center align-items-center'>
                <h3 className='mb-0 mt-0'>{product.name}</h3>
            </div>
            <div className='icons d-flex justify-content-between align-items-center'>
                <div className='icon-circle d-flex justify-content-center align-items-center' onClick={handleOpenEdit}>
                    <Pencil color='#E32424' size={24} />
                </div>
                <div className='icon-circle d-flex justify-content-center align-items-center' onClick={handleOpenDel}>
                    <Trash color='#E32424' size={24}/>
                </div>
            </div>
        </button>

        <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title>
                  {modalType === 'del' && <>Deletar produto</>}
                  {modalType === 'edit' && <>Editar produto</>}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
                {modalType === 'del' && <p className='mb-0'>Deseja mesmo apagar o produto {product.name}?</p>}
                {modalType === 'edit' && (<div>
                    <div className="d-flex justify-content-between">
                        <InputText name='name' value={name} setAttr={setName} condition={(name) => name.length > 0}><p className='text-black mb-1'>Nome do produto:</p></InputText>
                        <InputText name='name' value={price} setAttr={setPrice} condition={(price) => price > 0} type={'number'}><p className='text-black mb-1'>Preço do produto:</p></InputText>
                    </div>
                    <InputText name='description' value={description} setAttr={setDescription} condition={(description) => description.length > 0}><p className='text-black mb-1'>Descrição do produto:</p></InputText>
                    <InputText name='image' value={image} setAttr={setImage} condition={(image) => true}><p className='text-black mb-1'>Link da foto:</p></InputText>
                    <InputText name='ingredients' value={ingredients} setAttr={setIngredients} condition={(ingredients) => ingredients.length > 0}><p className='text-black mb-1'>Ingredientes:</p></InputText>

                    <div className="radio-category mt-3 d-flex justify-content-between flex-wrap">
                        {categories && categories.map((category) => <div key={category.id}>
                      <input type="radio" value={category.id} name='category' id={category.name} onChange={(e) => setSelectedCategory(e.target.value)}/> {category.name}
                    </div>)}
                    </div>



                </div>)}
          </Modal.Body>

          <Modal.Footer>
            {modalType === 'del' && <button className='apagar' disabled={loading ? true:false} onClick={delProduct}>Apagar produto</button>}
            {modalType === 'edit' && <button className='editar' disabled={loading ? true:false} onClick={editProduct}>Editar produto</button>}

            <button className='close' onClick={handleClose}>Fechar</button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default MenuContent