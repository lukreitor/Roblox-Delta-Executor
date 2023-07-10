import React, { useContext, useEffect, useState } from 'react'
import { RoleContext } from '../context/RoleContext';

import Modal from 'react-bootstrap/Modal';

import './Table.css'
import { useFetchCRUD } from '../hooks/useFetchCRUD';
import { RoutesContext } from '../context/RoutesContext';

const Table = ({ table, tables, setTables }) => {
    const { role, token } = useContext(RoleContext);
    const { urls } = useContext(RoutesContext);

    const [show, setShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [modalType, setModalType] = useState('');
    const [novaTable, setNovaTable] = useState(null);
    const [loadingPass, setLoadingPass] = useState(false);
    const [del, setDel] = useState(false);

    const { data:users, httpConfig, setCallFetch, loading } = useFetchCRUD(urls.user, token);

    const handleClose = () => {
      setShow(false);
      setModalTitle('');
      setModalBody('');
      setModalType('');
    }

    const gerarSenha = async () => {
      setLoadingPass(true);
      try{
        const res = await fetch(`${urls.table}gen-password/${table.id}`, {headers: {'Authorization':`Bearer ${token}`,}});
        const json = await res.json();

        setNovaTable({
          cpf: table.cpf,
          deleted: table.deleted,
          id: table.id,
          password: json.password,
          salary: table.salary,
          userRole: table.userRole,
          username: table.username,
        });

        setCallFetch(novaTable);
        setTables(users.filter((user) => user.userRole === "TABLE_ROLE"));
      } catch(error){
        console.log(error.message);
      }

      setLoadingPass(false);
      handleClose();
    }

    const delTable = () => {
      httpConfig(table, "DELETE", token);

      setDel(true);

      handleClose();
    }

    useEffect(() => {
        if(!loading && del){
          setTables(users.filter((user) => user.userRole === "TABLE_ROLE" && user.id !== table.id));
          setDel(false);
        }
    }, [setTables, loading, users, table, del]);
    


    const handleShowDel = () => {
      setShow(true);
      setModalTitle("Deletar mesa");
      setModalBody(`Tem certeza que deseja deletar a Mesa ${table.username}?`);
      setModalType("delete");
    }

    const handleShowGerar = () => {
      setShow(true);
      setModalTitle("Deseja gerar nova senha?");
      setModalBody(`Confirme para gerar nova senha`);
      setModalType("gerar");
    }

    const handleShowVer = () => {
      setShow(true);
      setModalTitle("Ver senha");
      if(novaTable !== null){
        setModalBody(`A senha é: ${novaTable.password}`);
      } else {
        setModalBody(`Você precisa gerar uma senha antes de poder vê-la!`);
      }
      setModalType("ver");
    }

  return (
    <div className='table-component d-flex flex-column justify-content-center align-items-center p-3'>
        <div>
            <h2>Mesa { table.username }</h2>
        </div>
        <div className='d-flex flex-column align-items-center justify-content-center'>
            <button onClick={handleShowVer} className='btn-outline'>Ver senha</button>
            <button onClick={handleShowGerar} className='btn-outline'>Gerar senha</button>
            { role === 'ADMIN' && <button onClick={handleShowDel} className='btn-red'>Apagar mesa</button>}
        </div>

        <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalTitle}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {modalBody}
          </Modal.Body>

          <Modal.Footer>
            {modalType === "gerar" && <button className='genPass' onClick={gerarSenha} disabled={loadingPass ? true:false}>Gerar senha</button>}
            {modalType === "delete" && <button className='delTable' onClick={delTable}>Deletar mesa</button>}
            {modalType === "delete" && <button className='cancel' onClick={handleClose}>Cancelar</button>}
            {(modalType === "gerar" || modalType === "ver") && <button className='cancel' onClick={handleClose}>Fechar</button>}
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default Table