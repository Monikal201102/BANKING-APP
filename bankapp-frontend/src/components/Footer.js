import React from 'react';
import '../styles/footer.css'; // 👈 Import the CSS

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} My Bank. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
