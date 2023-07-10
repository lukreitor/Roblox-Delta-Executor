import React, { useContext, useEffect, useState } from 'react';
import { Pencil, Trash } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import { RoleContext } from '../context/RoleContext';
import { RoutesContext } from '../context/RoutesContext';
import InputText from '../components/InputText';

import './ProfileLine.css';
import { useFetchCRUD } from '../hooks/useFetchCRUD';

const ProfileLine = ({ profileProp, profiles, setProfiles }) => {
  const { urls } = useContext(RoutesContext);
  const { token } = useContext(RoleContext);
  const [userRole, setUserRole] = useState('');
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState('');
  const [profile, setProfile] = useState(profileProp)

  const { httpConfig, loading } = useFetchCRUD(urls.user, token);

  const [cpf, setCpf] = useState(profile.cpf);
  const [name, setName] = useState(profile.name);
  const [password, setPassword] = useState('');
  const [salary, setSalary] = useState(profile.salary);
  const [username, setUsername] = useState(profile.username);
  const [role, setRole] = useState(profile.userRole);

  const handleClose = () => {
    setModalType('');
    setShow(false);
  }

  const editProfile = async () => {
    const newProfile = {
      name,
      cpf: String.toString(cpf),
      password,
      salary,
      username,
      id: profile.id,
      userRole: role
    }

    httpConfig(newProfile, "PUT",  token);

    setProfile(newProfile);

    handleClose();
  }

  const delProfile = async () => {
    try{
      await fetch(`${urls.user}/delete/${profile.id}`, {
        method: "DELETE",
        headers: {
          'Authorization':`Bearer ${token}`,
        }
      });

    setProfiles(profiles.filter(p => {return p.id !== profile.id}));
    } catch (error){
      console.log(error.message);
    }
    handleClose();
  }



  const handleOpenDel = () => {
    setModalType('del');
    setShow(true);
  }

  const handleOpenEdit = () => {
    setModalType('edit');
    setShow(true);
  }
  
  useEffect(() => {
    const role = () => {
      if(profile.userRole === 'ADMIN_ROLE'){
        setUserRole('Administrador');
        return;
      }
      
      if(profile.userRole === 'WAITER_ROLE'){
        setUserRole('Garçom');
        return;
      }
     
      if(profile.userRole === 'ATTENDANT_ROLE'){
        setUserRole('Atendente');
        return;
      }
  
      if(profile.userRole === 'KITCHEN_ROLE'){
        setUserRole('Cozinha');
        return;
      }

      setUserRole('Visitante');
    }

    role();
  }, [profile]);

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
    <div className='profile-line-component d-flex justify-content-between align-items-center'>
        <div className='id-container d-flex justify-content-center'>
          <h2>{ profile.id }</h2>
        </div>
        <div className='name-container d-flex justify-content-center align-items-center'>
          <h2>{ profile.name }</h2>
        </div>
        <div className='cpf-container d-flex justify-content-center align-items-center'>
          <h2>{ profile.cpf }</h2>
        </div>
        <div className='role-container d-flex justify-content-center align-items-center'>
          <h2>{ userRole }</h2>
        </div>
        <div className='salary-container d-flex justify-content-center align-items-center'>
          <h2>{ profile.salary }</h2>
        </div>


        <div className='profile-icons-container d-flex'>
            <div className='icon-circle d-flex justify-content-center align-items-center' onClick={handleOpenEdit}>
                <Pencil size={24} color='#fff'/>
            </div>
            <div className='icon-circle d-flex justify-content-center align-items-center' onClick={handleOpenDel}>
                <Trash size={24} color='#fff'/>
            </div>
        </div>

        <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title>
                  {modalType === 'edit' && <>Editar usuário</>}
                  {modalType === 'del' && <>Apagar usuário</>}

            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
              {modalType === 'edit' && (
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
                  <InputText name='password' value={password} setAttr={setPassword} condition={(pass) => pass.length > 3} type={'password'}><p className='text-black mb-1'>Senha:</p></InputText>
                  <div className='radio-role'>
                    <div>
                      <input type="radio" value="ADMIN_ROLE" name='role' id="admin" onChange={(e) => setRole(e.target.value)} checked={profile.userRole === "ADMIN_ROLE"}/> Administrador
                    </div>
                    <div>
                      <input type="radio" value="ATTENDANT_ROLE" name='role' id="attendant" onChange={(e) => setRole(e.target.value)} checked={profile.userRole === "ATTENDANT_ROLE"}/> Atendente
                    </div>
                    <div>
                      <input type="radio" value="KITCHEN_ROLE" name='role' id="kitchen" onChange={(e) => setRole(e.target.value)} checked={profile.userRole === "KITCHEN_ROLE"}/> Cozinha
                    </div>
                    <div>
                      <input type="radio" value="WAITER_ROLE" name='role' id="waiter" onChange={(e) => setRole(e.target.value)} checked={profile.userRole === "WAITER_ROLE"}/> Garçom
                    </div>
                    
                  </div>
                </div>
              </div>)}
              {modalType === 'del' && <>Tem certeza que deseja apagar o usuário do(a) {profile.name}?</>}
          </Modal.Body>

          <Modal.Footer>
           {modalType === 'edit' && <button className='editar' onClick={editProfile} disabled={loading ? true : false}>Editar usuário</button>}
           {modalType === 'del' && <button className='apagar' onClick={delProfile} disabled={loading ? true : false}>Apagar usuário</button>}
            <button className='close' onClick={handleClose}>Fechar</button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default ProfileLine