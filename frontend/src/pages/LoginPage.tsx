
import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../components/NavBar';
import { loginAction } from '../store/actions/AuthAction';
import { authSelectorState } from '../store/selectors/AuthSelector';
import { Navigate } from 'react-router-dom';


const LoginPage = () => {
    const dispatch = useDispatch();
    const {user, loading, error} = useSelector(authSelectorState)

    const [data , setData ] = useState(
        {
            username:  "",
            password:  ""
        }
    )

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setData({
            ...data,
            [name]: value
        });
        console.log(data)
    }

    const handleOnSubmit =  (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginAction(data) as any);
   
        
    }

    if (user) {
        return <Navigate to={'/'} />
    }

  return (
    <>
        <NavBar />
        <br />
        {
            error ? (<div
                className="alert alert-danger"
                role="alert"
            >
                <strong>{error}</strong>
            </div>): ""
            
        }
        <form onSubmit={handleOnSubmit}>
            <div>
                <label htmlFor="">Email</label>
                <input type="text"  placeholder='Email' onChange={handleOnChange} name='username'/>
            </div>

            <div>
                <label htmlFor="">Password</label>
                <input type="password"  placeholder='Password' onChange={handleOnChange} name='password'/>
            </div>
           {loading ?  (
                <button className="btn btn-primary" type="submit" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true">   
                    </span>
                        Loading...
                    </button>): ( <button type="submit">Sigin</button>)}
        </form>
    </>
  )
}



export default LoginPage