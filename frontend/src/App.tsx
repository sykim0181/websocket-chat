import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTheme, ThemeProvider } from '@mui/material'

import './App.css'
import Home from './pages/Home'
import Room from './pages/Room'
import Rooms from './pages/Rooms'
import { UserContextProvider } from './context/UserContext'

const queryClient = new QueryClient();

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'black',
          color: 'white',
        }
      }
    }
  }
});

function App() {
  return (
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/room/:roomId" element={<Room />} />
              <Route path="/rooms" element={<Rooms />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </UserContextProvider>
  )
}

export default App
