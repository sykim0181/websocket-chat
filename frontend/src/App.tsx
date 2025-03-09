import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './App.css'
import Home from './pages/Home'
import Room from './pages/Room'
import Rooms from './pages/Rooms'
import { UserContextProvider } from './context/UserContext'

const queryClient = new QueryClient();

function App() {
  return (
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/rooms" element={<Rooms />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </UserContextProvider>
  )
}

export default App
