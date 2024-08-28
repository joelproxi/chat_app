import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

import store from './store'
import { ProtectedRoutes } from './routes/ProtectedRoutes'
import ContactPage from './pages/ContactPage'




const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes >
        <Route
          path="/"
          // element={ <ProtectedRoutes><ChatPage /></ProtectedRoutes> 
            element={ <ChatPage /> 
          }
        />
        <Route
          path="/:contact"
          element={ <ProtectedRoutes><ChatPage /></ProtectedRoutes> 
          }
        />
        <Route
          path="/contact"
          element={ <ProtectedRoutes><ContactPage /></ProtectedRoutes> 
          }
        />
          <Route path='login' element={<LoginPage />}  />
          <Route path='register' element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>



  )
}

export default App