import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SigninPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignin = async () => {
    try {
      const response = await fetch('https://n6aqvbq3qg.execute-api.ap-south-1.amazonaws.com/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signin successful:', data);
        navigate('/share'); // Navigate to ShareFilePage
      } else {
        setError(data.message || 'Signin failed');
      }
    } catch (err) {
      console.error('Signin error:', err);
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign In</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button onClick={handleSignin} style={styles.button}>Sign In</button>
        <p style={styles.linkText}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    minWidth: '300px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '1.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
  },
  linkText: {
    marginTop: '1rem',
    fontSize: '0.9rem',
  },
};

export default SigninPage;
