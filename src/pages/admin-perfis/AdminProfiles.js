import React, { useContext, useEffect, useState } from 'react';

import './AdminProfiles.css';

import { ChevronDoubleLeft, ChevronDoubleRight, ChevronLeft, ChevronRight, Search } from 'react-bootstrap-icons'

import SideMenu from '../../components/SideMenu'
import ProfileLine from '../../components/ProfileLine';
import { useFetchCRUD } from '../../hooks/useFetchCRUD';
import { RoutesContext } from '../../context/RoutesContext';
import { RoleContext } from '../../context/RoleContext';
import Modal from 'react-bootstrap/Modal';
import InputText from '../../components/InputText';

const AdminProfiles = () => {
    const [page, setPage] = useState(1);
    const { urls } = useContext(RoutesContext);
    const { token } = useContext(RoleContext);
    const { data: users, loading, httpConfig} = useFetchCRUD(urls.user, token);
    
    const [show, setShow] = useState(false);
    
    const [profiles, setProfiles] = useState([]);

    const [search, setSearch] = useState('');
 
    useEffect(() => {
        setProfiles(users.filter((user) => user.userRole !== 'TABLE_ROLE'));
    }, [users]);

    useEffect(() => {
      if(users !== []){
        try{
          setProfiles(users.filter(user => user.userRole !== 'TABLE_ROLE' && user.name.toLowerCase().includes(search.toLowerCase())));
        } catch(error){
          setProfiles(users.filter((user) => user.userRole !== 'TABLE_ROLE'));
        }
      }
    }, [search, users])


    const pageMax = Math.ceil(profiles.length / 6);
  
    const profilesExhibition = profiles.slice(6 * (page-1), 6 * page);

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [cpf, setCpf] = useState('');
    const [salary, setSalary] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');


    const handleClose = () => {
        setShow(false);
    }

    const handleOpen = () => {
        setShow(true);
    }
    
    const handleCreate = () => {
        const newUser = {
            name,
            username,
            cpf,
            salary,
            password,
            userRole: role,
            id: null
        }

        httpConfig(newUser, 'CREATE');

        handleClose();
    }

    const cpfCondition = (cpf) => {
        let pDigVerificador = ((cpf.charAt(0) * 10 + cpf.charAt(1) * 9 + cpf.charAt(2) * 8 + cpf.charAt(3) * 7 + cpf.charAt(4) * 6 + cpf.charAt(5) * 5 + cpf.charAt(6) * 4 + cpf.charAt(7) * 3 + cpf.charAt(8) * 2)* 10) % 11;
    
        let sDigVerificador = ((cpf.charAt(0) * 11 + cpf.charAt(1) * 10 + cpf.charAt(2) * 9 + cpf.charAt(3) * 8 + cpf.charAt(4) * 7 + cpf.charAt(5) * 6 + cpf.charAt(6) * 5 + cpf.charAt(7) * 4 + cpf.charAt(8) * 3 + cpf.charAt(9) * 2)* 10) % 11;
    
        if(pDigVerificador === 10){
          pDigVerificador = 0;
        }
    
        if (sDigVerificador === 10){
          sDigVerificador = 0;
        }
    
        return !!(pDigVerificador === parseInt(cpf.charAt(9)) && sDigVerificador === parseInt(cpf.charAt(10)));
      }

  return (
    <div className='admin-perfis'>
        <SideMenu page='perfis'/>
        <aside className='admin-perfis-board'>
            <div className='perfis-header'>
                <button className='add-profile' onClick={handleOpen}>Criar usuário</button>
                <div className='search-bar'>
                    <button>
                        <Search size={20} color='#fff'/>
                    </button>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            <div className='table-header'>
                <div className='id-header-container d-flex justify-content-center align-items-center'>
                    <h2>ID</h2>
                </div>
                <div className='name-header-container d-flex justify-content-center align-items-center'>
                    <h2>Nome</h2>
                </div>
                <div className='cpf-header-container d-flex justify-content-center align-items-center'>
                    <h2>CPF</h2>
                </div>
                <div className='role-header-container d-flex justify-content-center align-items-center'>
                    <h2>Cargo</h2>
                </div>
                <div className='salary-header-container d-flex justify-content-center align-items-center'>
                    <h2>Salário</h2>
                </div>
                <div className='buttons-header-container'></div>
            </div>
            <div className='table-body'>
                {!loading && profilesExhibition && profilesExhibition.map((profile) => <ProfileLine key={profile.id} profileProp={profile} profiles={profiles} setProfiles={setProfiles}/>)}
                {loading && (<div className='loading-container'>
                                <div className='loading'></div>
                            </div>)}
            </div>
            <div className="table-footer d-flex justify-content-center align-items-center w-100">
                <button 
                        className="footer-button" 
                        disabled={page < 3 ? true : false}
                        onClick={() => setPage(1)}><ChevronDoubleLeft size={24} color='#fff'/></button>
                
                <button className="footer-button" 
                        disabled={page === 1 ? true : false} 
                        onClick={() => {if(page !== 1){ setPage(page - 1)}}}><ChevronLeft size={24} color='#fff'/></button>
                
                <button 
                        className="footer-button"
                        onClick={() => {if(page !== 1){ setPage(page - 1)}}}>{page === 1 ? page : page - 1}</button>
                
                <button 
                        className="footer-button" 
                        onClick={() => {if(page === 1){ setPage(2)}}}>{page === 1 ? page + 1: page}</button>
                
                <button 
                        className="footer-button" 
                        onClick={() => page === 1 ? setPage(3) : setPage(page+1)}>{page === 1 ? page + 2 : page + 1}</button>
                
                <button 
                        className="footer-button" 
                        disabled={page === pageMax ? true : false}
                        onClick={() => setPage(page + 1)}><ChevronRight size={24} color='#fff'/></button>
                
                <button 
                        className="footer-button"
                        disabled={pageMax === page + 1 ? true : false}
                        onClick={() => setPage(pageMax === 0 ? 1 : pageMax)}><ChevronDoubleRight size={24} color='#fff'/></button>
            </div>
        </aside>

        <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title>
                  Criar usuário
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
              <div>
                <div className='d-flex justify-content-between align-items-center'>
                  <InputText name='name' value={name} setAttr={setName} condition={(name) => name.length > 0}><p className='text-black mb-1'>Nome:</p></InputText>
                  <InputText name='username' value={username} setAttr={setUsername} condition={(name) => name.length > 3}><p className='text-black mb-1'>Nome de usuário:</p></InputText>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                  <InputText name='cpf' value={cpf} setAttr={setCpf} condition={cpfCondition}><p className='text-black mb-1'>CPF:</p></InputText>
                  <InputText name='salary' value={salary} setAttr={setSalary} condition={(salary) => salary > 1313}><p className='text-black mb-1'>Salário:</p></InputText>
                </div>
                <div className='d-flex'>
                  <InputText name='password' value={password} setAttr={setPassword} condition={(pass) => pass.length > 3} type='password'><p className='text-black mb-1'>Senha:</p></InputText>
                  <div className='radio-role' onChange={(e) => setRole(e.target.value)}>
                    <div>
                      <input type="radio" value="ADMIN_ROLE" name='role' id="admin" /> Administrador
                    </div>
                    <div>
                      <input type="radio" value="ATTENDANT_ROLE" name='role' id="kitchen" /> Atendente
                    </div>
                    <div>
                      <input type="radio" value="KITCHEN_ROLE" name='role' id="kitchen" /> Cozinha
                    </div>
                    <div>
                      <input type="radio" value="WAITER_ROLE" name='role' id="waiter" /> Garçom
                    </div>
                    
                  </div>
                </div>
              </div>
          </Modal.Body>

          <Modal.Footer>
            <button className='editar' onClick={handleCreate} disabled={loading ? true : false}>Criar usuário</button>
            <button className='close' onClick={handleClose}>Fechar</button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default AdminProfiles