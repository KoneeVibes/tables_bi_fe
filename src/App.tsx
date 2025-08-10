import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { SignIn } from './page/authentication/signin';
import { SignUp } from './page/authentication/signup';
import { ProfileCompletion } from './page/authentication/profilecompletion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/complete-profile/:id' element={<ProfileCompletion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
