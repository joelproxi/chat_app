import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { useEffect } from 'react';
import { authSelectorState } from '../store/selectors/AuthSelector'
import { logoutAction } from '../store/actions/AuthAction';


const NavBar = () => {
  const { user } = useSelector(authSelectorState);
  const dispatch = useDispatch();

  const logout =  () => {
     dispatch(logoutAction() as any);
     if(user?.token){
      return <Navigate to={'login'} />
      }
  }

  useEffect(() => {
  }, [user])
  
  return (
    <nav>
      {
        !user ? <div>  
            <Link to={'/login'}>Login</Link>
          <Link to={'/register'}>Register</Link></div>
        : <div> 
            <Link to={''} onClick={() => logout()}>logout</Link>
            <Link to={'/contact'}>Contact</Link>
        </div>
      }   
    </nav>

  )
}

export default NavBar;