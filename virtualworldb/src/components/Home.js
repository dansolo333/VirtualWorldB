import React, { useEffect, useState } from 'react';
import './Home.css';
import Pic from './media/avatarBid.png';

function Home({ username }) {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            fetch(`https://virtualworldb-server.onrender.com/user/${storedUsername}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => setUserData(data))
                .catch(error => setError(error));
        }
    }, []);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(userData.walletAddress);
        alert('Wallet address copied to clipboard');
    };

    if (error) {
        return <div>{error.message}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    // Generate the full URL for the profile photo
    const profilePhotoUrl = userData.profilePhoto ? `https://virtualworldb-server.onrender.com/static/${userData.profilePhoto.split("media/")[1]}` : Pic;

    return (
        <div id="main-home">
            <section id="profile-sec" className="profile-sec">
                <div className="headline">
                    <h2>Virtual World B Headlines</h2>
                </div>
                <figure id="profile-fig">
                    <img id="profile-pic" src={profilePhotoUrl} alt="profile of user" />
                    <figcaption id="profile-cap">{userData.username}</figcaption>
                </figure>
                <div id="profile-info">
                    <p className='truncated-text'>{userData.walletAddress}</p>
                    <button onClick={handleCopyClick}>Copy Wallet Address</button>
                    <p>${userData.balance}</p>
                </div>
            </section>
        </div>
    );
}

export default Home;
