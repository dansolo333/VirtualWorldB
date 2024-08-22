import React, { useState, useEffect } from 'react';
import './Settings.css';
import profPic from './media/avatarBid.png';

function Settings({ currentUser }) {
  const [username, setUsername] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newProfilePhoto, setNewProfilePhoto] = useState('');
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://virtualworldb.onrender.com/user/${currentUser}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsername(data.username);
        setProfilePhoto(data.profilePhoto || ''); 
        setWalletAddress(data.walletAddress || '');
        setNewUsername(data.username);
        setNewProfilePhoto(data.profilePhoto || '');
        setNewWalletAddress(data.walletAddress || '');
      } catch (error) {
        setError('Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://virtualworldb.onrender.com/user/${currentUser}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, profilePhoto: newProfilePhoto, walletAddress: newWalletAddress })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail);
        setSuccess('');
      } else {
        setSuccess('Profile updated successfully');
        setError('');
      }
    } catch (error) {
      setError('An error occurred.');
      setSuccess('');
    }
  };

  const handleCopyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    alert('Wallet address copied to clipboard!');
  };

  // Generate the full URL for the profile photo
  const profilePhotoUrl = profilePhoto ? `https://virtualworldb.onrender.com/static/${profilePhoto.split("media/")[1]}` : profPic;

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <div className="profile-display">
        <img
          src={profilePhotoUrl}
          alt="Profile"
          className="profile-pic"
        />
        <p>Current Username: {username}</p>
        <p className='truncated-text'>Wallet Address: {walletAddress}</p>
        <button onClick={handleCopyWalletAddress}>Copy Wallet Address</button>
      </div>
      <input
        type="text"
        placeholder="New Username"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="New Profile Photo URL"
        value={newProfilePhoto}
        onChange={(e) => setNewProfilePhoto(e.target.value)}
      />
      <input
        className='truncated-text'
        type="text"
        placeholder="New Wallet Address"
        value={newWalletAddress}
        onChange={(e) => setNewWalletAddress(e.target.value)}
      />
      <button onClick={handleUpdate}>Update Profile</button>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default Settings;
