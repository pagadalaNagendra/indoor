// import { Link } from 'react-router-dom';
// import { Component } from 'react';
// import './index.css';

// class Navbar extends Component {
//     render() {
//         return (
//             <nav className="navbar">
//                 <div className="logo-containersd">
//                     <img src="https://res.cloudinary.com/dxoq1rrh4/image/upload/v1721754287/left_xfp4qb.png" alt="Logo 1" className="logo" />
//                 </div>
//                 <div className="title-container">
//                     <h1 className="navbar-title">Indoor Air Quality</h1>
//                 </div>
//                 <div className="logo-containers">
//                     <img src="https://res.cloudinary.com/dxoq1rrh4/image/upload/v1721739306/smartcity_jgrecd.png" alt="Logo 2" className="logo" />
//                 </div>
//             </nav>
//         );
//     }
// }

// export default Navbar;


import React, { useState } from 'react';
import './index.css';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="navbar">
      
      <div className="navbar-title">Copy rights S@SCRC TEAM</div>

    </div>
  );
};

export default Navbar;
