import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IUserModel } from '../models/UserModel'
import APIService from '../services/APIService';

const ContactPage = () => {
    const [users, setUsers] = useState<IUserModel[]>([])
    const navigate = useNavigate();

    const handleContactOnClick = (contact: IUserModel) => {
        

        navigate(`/${contact.telephone}`);
    }

    useEffect(() => {
        const fetchUsersList = async () => {
            const resp = await APIService.getUsers();
            if(resp.status === 200){
            setUsers(resp.data);
            }
        }
        fetchUsersList();
    }, [])

  return (
    <div>
       {
        users?.map( (user: IUserModel) => {
            return ( <li key={user.telephone}><a href=""  onClick={() => handleContactOnClick(user)}>{user.full_name} </a></li>)
        })
       }
    </div>
  )
}

export default ContactPage