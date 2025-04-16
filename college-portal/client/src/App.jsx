import React from 'react';
import FluidContainer from './components/FluidContainer';
import FloatingElement from './components/FloatingElement';
import FluidNavbar from './components/FluidNavbar'; // Import the new navbar
import './App.css';

function App() {
  const navLinks = [
    { text: 'Dashboard', href: '/dashboard' },
    { text: 'Profile', href: '/profile' },
    { text: 'Academics', href: '/academics' },
    { text: 'Projects', href: '/projects' },
    { text: 'Settings', href: '/settings' },
  ];

  return (
    <FluidContainer>
      <FluidNavbar links={navLinks} />
      <div style={{ paddingTop: '80px', padding: '20px', color: 'white' }}>
        {/* Content of your application will go here */}
        <h1>Welcome to the Student Hub</h1>
        <p>This is the beginning of our fluid interface.</p>
        {/* You can add more FloatingElement components for other content */}
        <FloatingElement style={{ marginTop: '2rem' }}>
          <button style={{ padding: '1rem 2rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Fluid Button
          </button>
        </FloatingElement>
      </div>
    </FluidContainer>
  );
}

export default App;