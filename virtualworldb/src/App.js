import './App.css';
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Welcome from './components/Welcome';
import Chat from './components/Chat';
import SignUp from './components/SignUp';
import Settings from './components/Settings';
import SearchUsers from './components/SearchUsers';
import SendMoney from './components/SendMoney';
import SuiWallet from './components/SuiWallet';
import HomeLogo from './components/media/home.svg';
import SettingsLogo from './components/media/settings.svg';
import ChatLogo from './components/media/chat-icon.svg';
import SearchLogo from './components/media/search.svg';

function App() {
  const [username, setUsername] = useState(''); // Current logged-in user
  const [menuOpen, setMenuOpen] = useState(false); // Menu open/close state
  const [recipient, setRecipient] = useState(''); // Selected chat recipient
  const [activeChats, setActiveChats] = useState([]); // List of active chat users

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAddChat = (newRecipient) => {
    // Add the new recipient to the list of active chats if not already present
    if (!activeChats.includes(newRecipient)) {
      setActiveChats([...activeChats, newRecipient]);
    }
    setRecipient(newRecipient); // Set the current recipient for the chat
  };

  return (
    <BrowserRouter >
      <div className="App">
        <div id="navbar">
          <div id="left-nav">
            <p>VIRTUAL WORLD B</p>
          </div>
          <div id="right-nav" onClick={toggleMenu}>
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div id="menu-bar" className={menuOpen ? 'open' : ''}>
          <button className="close-btn" onClick={toggleMenu}>X</button>
          <p>See more</p>
          <p>About Us</p>
          <p>Contact</p>
        </div>
        <div id="sidebar">
          <div id="up-sidebar">
            <Link className="link" to="/home"><img src={HomeLogo} alt="Home" /></Link>
            <Link className="link" to="/chat"><img src={ChatLogo} alt="Chat" /></Link>
            {/* <Link className="link" to="/chatapp"><img src={ChatLogo} alt="Chat" /></Link> */}
            <Link to="/search">
              <img src={SearchLogo} alt="Search" />
            </Link>
          </div>
          <div id="down-sidebar">
            <Link className='link' to="/settings"><img src={SettingsLogo} alt='Settings'/></Link>
          </div>
        </div>
        <div id="main-content">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home username={username} />} />
            <Route path="/login" element={<Login setUsername={setUsername} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/chat" element={<Chat username={username} recipient={recipient}/>} />
            <Route path="/settings" element={<Settings currentUser={username} /> }/>
            <Route path="/search" element={<SearchUsers username={username}/>} />
            <Route path="/sendmoney" element={<SendMoney />} />
            <Route path="/suiwallet" element={<SuiWallet />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
