import {  Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authSelectorState } from '../store/selectors/AuthSelector';


export function ProtectedRoutes({ children }: { children: any }) {
    const { user } = useSelector(authSelectorState);
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }