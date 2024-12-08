import React from 'react';
import { useSpring, animated } from 'react-spring';
import './style.css'; 

function Home() {
  const props = useSpring({
    from: { transform: 'translateY(-20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    config: { tension: 170, friction: 12 }, 
  });

  return (
    <div className="home">
      <h1 className="home-text">Welcome to AI Tools</h1> 
      <h2 className="home-heading">Discover the Future of Technology</h2>
      <animated.div style={props}>
        <h3 className="intro-text">Discover Now!</h3> 
      </animated.div>
    </div>
  );
}

export default Home;
