// import React, { useState } from 'react';
// import './SearchUsers.css';

// function SearchUsers() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [error, setError] = useState(null);

//   const handleSearch = async () => {
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/users?search=${searchTerm}`);
//       const data = await response.json();
//       if (response.ok) {
//         setSearchResults(data);
//       } else {
//         setError(data.detail);
//       }
//     } catch (error) {
//       setError('An error occurred.');
//     }
//   };

//   return (
//     <div className="search-users">
//       <h2>Search Users</h2>
//       <input
//         type="text"
//         placeholder="Search by username"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <button onClick={handleSearch}>Search</button>
//       {error && <p className="error">{error}</p>}
//       <ul>
//         {searchResults.map(user => (
//           <li key={user.username}>
//             <img src={user.profilePhoto || 'default-profile-pic.jpg'} alt="Profile" className="profile-pic" />
//             <p>{user.username}</p>
//             <button onClick={() => window.location.href = `/chat?recipient=${user.username}`}>Chat</button>
//             <button onClick={() => window.location.href = `/sendmoney?recipient=${user.username}`}>Send Money</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default SearchUsers;



import React, { useState } from 'react';
import './SearchUsers.css';

function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://virtualworldb.onrender.com/users?search=${searchTerm}`);
      const data = await response.json();
      if (response.ok) {
        setSearchResults(data);
      } else {
        setError(data.detail);
      }
    } catch (error) {
      setError('An error occurred.');
    }
  };

  const openSuietExtensionToSendMoney = (walletAddress) => {
    const suietUrl = `chrome-extension://khpkpbbcccdmmclmpigdgddabeilkdpd/index.html#/send?recipient=${walletAddress}`;
    window.open(suietUrl, '_blank');
  };

  return (
    <div className="search-users">
      <h2>Search Users</h2>
      <input
        type="text"
        placeholder="Search by username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p className="error">{error}</p>}
      <ul>
        {searchResults.map(user => {
          // Provide a default image URL if user.profilePhoto is null or undefined
          const profilePhotoUrl = user.profilePhoto 
            ? `https://virtualworldb.onrender.com/static/${user.profilePhoto.split('media/')[1]}`
            : 'https://virtualworldb.onrender.com/static/default-profile-pic.jpg'; // Use a default profile picture URL

          return (
            <li key={user.username}>
              <img 
                src={profilePhotoUrl} 
                alt="Profile" 
                className="profile-pic" 
              />
              <p>{user.username}</p>
              <p className='truncated-text'>{user.walletAddress}</p>
              <button onClick={() => window.location.href = `/chat?recipient=${user.username}`}>Chat</button>
              <button onClick={() => openSuietExtensionToSendMoney(user.walletAddress)}>Send Money</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchUsers;
