import React, { useContext, useEffect, useState } from 'react';

import './CategoryCard.css';

import { Pencil, Trash } from 'react-bootstrap-icons';

import Modal from 'react-bootstrap/Modal';
import InputText from '../components/InputText';
import { RoleContext } from '../context/RoleContext';
import { RoutesContext } from '../context/RoutesContext';
import { useFetchCRUD } from '../hooks/useFetchCRUD';

const CategoryCard = ({category: categoryProp, categories}) => {
    const [modalType, setModalType] = useState('');
    const [show, setShow] = useState(false);
    const [category, setCategory] = useState(categoryProp);
    const [name, setName] = useState(category.name);


    const [del, setDel] = useState(false);

    const { urls } = useContext(RoutesContext);
    const { token } = useContext(RoleContext);
    const { httpConfig, loading } = useFetchCRUD(urls.category, token);

    const handleClose = () => {
        setShow(false);
    }

    const delCategory = () => {
        httpConfig(category, 'DELETE', token)
        setDel(true);
        handleClose();
    }

    const editCategory = () => {
        const editedCategory = {
            id: category.id,
            name,
            deleted: false,
        }

        httpConfig(editedCategory, 'PUT', token);
        
        setCategory(editedCategory);
        
        handleClose();
    }

    useEffect(() => {
        if(del){
            categories.filter((c) => c.id !== category.id);
            setDel(false);
        }
    }, [del, categories, category.id]);

  return (
    <>
        <div className='category-container d-flex justify-content-between align-items-center'>
            <p>{category.name}</p>
            <div className='icons d-flex justify-content-between align-items-center'>
                <div className='icon-circle d-flex justify-content-center align-items-center' onClick={() => {setModalType('edit'); setShow(true);}}>
                    <Pencil color='#E32424' size={24} />
                </div>
                <div className='icon-circle d-flex justify-content-center align-items-center' onClick={() => {setModalType('del'); setShow(true);}}>
                    <Trash color='#E32424' size={24}/>
                </div>
            </div>
        </div>

        <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title>
                  {modalType === 'del' && <>Deletar categoria</>}
                  {modalType === 'edit' && <>Editar categoria</>}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
                {modalType === 'del' && <p className='mb-0'>Deseja mesmo apagar a categoria {category.name}?</p>}
                {modalType === 'edit' && (<div>
                    <div className="d-flex justify-content-between">
                        <InputText name='name' value={name} setAttr={setName} condition={(name) => name.length > 0}><p className='text-black mb-1'>Nome da categoria:</p></InputText>
                    </div>
                </div>)}
          </Modal.Body>

          <Modal.Footer>
            {modalType === 'del' && <button className='apagar' disabled={loading ? true:false} onClick={delCategory}>Apagar categoria</button>}
            {modalType === 'edit' && <button className='editar' disabled={loading ? true:false} onClick={editCategory}>Editar categoria</button>}

            <button className='close' onClick={handleClose}>Fechar</button>
          </Modal.Footer>
        </Modal>
    </>

  )
}

export default CategoryCard