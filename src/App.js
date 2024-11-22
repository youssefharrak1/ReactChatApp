import { BrowserRouter as Router ,Route, Routes } from 'react-router-dom';
import './App.css';
import {Login} from "./user/Login";
import Register from './user/Register';
import UsersList from './user/UsersList';
import Chat from './user/Chat';
import Room from './user/Room';
import RequireAuth from './user/RequireAuth';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route element={<RequireAuth/>}>
        
        <Route path="/lists" element={<UsersList />} />
        <Route path='/messages/user/:id' element ={<Chat/>} ></Route>
        <Route path='/messages/room/:id' element ={<Room/>} ></Route>
        </Route>
       
      </Routes>
    </Router>
  );
}

export default App;
