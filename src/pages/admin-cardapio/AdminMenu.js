import React, { useContext, useEffect, useState } from 'react';

import './AdminMenu.css';

import SideMenu from '../../components/SideMenu';
import ProductCard from '../../components/ProductCard';
import Filter from '../../components/Filter';
import MenuContent from '../../components/MenuContent';
import { useFetchCRUD } from '../../hooks/useFetchCRUD';
import { RoutesContext } from '../../context/RoutesContext';

import Modal from 'react-bootstrap/Modal';
import InputText from '../../components/InputText';
import { RoleContext } from '../../context/RoleContext';

import CategoryCard from '../../components/CategoryCard';

const AdminMenu = () => {
    const { urls } = useContext(RoutesContext);

    const [ filter, setFilter ] = useState('todos');

    const { token } = useContext(RoleContext);
    const { data: categories, httpConfig: httpConfigCategory } = useFetchCRUD(urls.category);

    categories.sort((a,b) => {return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0});

    const { data: productsNotFilter, loading, httpConfig: httpConfigProduct } = useFetchCRUD(urls.product);
    

    const [ products, setProducts ] = useState(productsNotFilter);

    const [modalType, setModalType] = useState('');
    const [show, setShow] = useState(false);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(0);

    useEffect(() => {
        if(filter !== 'todos'){
            setProducts(productsNotFilter.filter((product) => product.category.name === filter))
        } else{
            setProducts(productsNotFilter);
        }
    }, [filter, productsNotFilter])
    
    const [ productCardExhibition, setProductCardExhibition ] = useState(products[0]);

    useEffect(() => {
        if(!loading){
            setProductCardExhibition(products[0]);
        }
    }, [loading, products]);

    const handleClose = () => {
        setShow(false);
    }

    const addProduct = () => {
        const newProduct = {
            category: categories.filter((category) => category.id === parseInt(selectedCategory))[0],
            name,
            price,
            image: image !== '' ? image : null,
            description,
            id: null,
            ingredients: ingredients.split(', '),
        }

        httpConfigProduct(newProduct, "CREATE", token);

        setName('');
        setPrice(0);
        setImage('');
        setDescription('');
        setIngredients('');
        handleClose();
    }

    const addCategory = () => {
        const newCategory = {
            name,
            id: null,
        }

        httpConfigCategory(newCategory, "CREATE", token);

        setName('');
        handleClose();
    }

  return (
    <div className='admin-menu'>
        <SideMenu page='cardapio'/>
        <aside className='admin-menu-board d-flex flex-column flex-lg-row justify-content-center align-items-center justify-content-lg-center align-items-lg-start'>
            <div className='col-10 col-lg-5 d-flex flex-column justify-content-between align-items-lg-start align-items-center'>
             <div className='w-100 d-flex justify-content-center align-items-center text-light mt-3'>
                    <h1>Produtos</h1>
                </div>
                <div className="filter">
                    <Filter filter={filter} setFilter={setFilter} categories={categories}/>
                </div>
                <div className="menu-container">
                    {!loading && products && products.map((product) => <MenuContent 
                                                                key={product.id} 
                                                                productProp={product} 
                                                                setProductCardExhibition={setProductCardExhibition}
                                                                products={products}
                                                                setProducts={setProducts}
                                                                active={product === productCardExhibition ? true:false}/>)}

                    {loading && (<div className='loading-container'>
                                <div className='loading'></div>
                            </div>)}
                </div>
            </div>

            <div className='col-10 col-lg-7 d-flex flex-column justify-content-between align-items-end h-100'>
                <div className="buttons-container d-flex justify-content-center align-items-center flex-wrap">
                    <button onClick={() => {setModalType('produto'); setShow(true)}}>Adicionar produto</button>
                    <button onClick={() => {setModalType('see-categoria'); setShow(true)}}>Gerenciar categorias</button>
                </div>
                <div className="card-container col-8 h-100">
                    {!loading && productCardExhibition && <ProductCard
                        id={productCardExhibition.id} 
                        photo={productCardExhibition.image} 
                        name={productCardExhibition.name} 
                        price={productCardExhibition.price} 
                        description={productCardExhibition.description}
                        ingredients={productCardExhibition.ingredients}
                        />}
                    
                    {loading && (<div className='loading-container'>
                                <div className='loading'></div>
                            </div>)}
                </div>
            </div>
        </aside>

        <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title>
                  {modalType === 'produto' && <>Criar produto</>}
                  {modalType === 'see-categoria' && <>Gerenciar categorias</>}
                  {modalType === 'add-categoria' && <>Criar categoria</>}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
                {modalType === 'add-categoria' && <div className='d-flex'>
                    <InputText name='name' value={name} setAttr={setName} condition={(name) => name.length > 0}><p className='text-black mb-1'>Nome da categoria:</p></InputText>
                </div>}

                {modalType === 'produto' && (<div>
                    <div className="d-flex justify-content-between">
                        <InputText name='name' value={name} setAttr={setName} condition={(name) => name.length > 0}><p className='text-black mb-1'>Nome do produto:</p></InputText>
                        <InputText name='name' value={price} setAttr={setPrice} condition={(price) => price > 0} type={'number'}><p className='text-black mb-1'>Preço do produto:</p></InputText>
                    </div>
                    <InputText name='description' value={description} setAttr={setDescription} condition={(description) => description.length > 0}><p className='text-black mb-1'>Descrição do produto:</p></InputText>
                    <InputText name='image' value={image} setAttr={setImage} condition={(image) => true}><p className='text-black mb-1'>Link da foto:</p></InputText>
                    <InputText name='ingredients' value={ingredients} setAttr={setIngredients} condition={(ingredients) => ingredients.length > 0}><p className='text-black mb-1'>Ingredientes:</p></InputText>

                    <div className="radio-category mt-3 d-flex justify-content-between flex-wrap" onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories && categories.map((category) => <div key={category.id}>
                      <input type="radio" value={category.id} name='category' id="category.name" /> {category.name}
                    </div>)}
                    </div>
                </div>)}
                
                {modalType === 'see-categoria' && 
                        (<div className='d-flex flex-column'>
                            {categories && categories.map((category) => <CategoryCard key={category.id} category={category} categories={categories}/>)}
                        </div>)}
          </Modal.Body>

          <Modal.Footer>
            {modalType === 'produto' && <button className='editar' disabled={loading ? true:false} onClick={addProduct}>Criar produto</button>}
            {modalType === 'see-categoria' && <button className='apagar' onClick={() => setModalType('add-categoria')}>Adicionar categoria</button>}
            {modalType === 'add-categoria' && <button className='editar' disabled={loading ? true:false} onClick={addCategory}>Criar categoria</button>}

            <button className='close' onClick={handleClose}>Fechar</button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default AdminMenu