import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #1404a8ff, #00c6ff)',
  },
  leftPane: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    padding: '0 40px',
    // Updated: Changed the left pane background to a semi-transparent blue
    background: 'rgba(20, 4, 168, 0.5)', 
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 20,
  },
  slogan: {
    fontSize: 18,
    fontWeight: '400',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 1.5,
    maxWidth: 300,
  },
  rightPane: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: '40px',
    borderBottomLeftRadius: '40px',
    boxShadow: '-10px 0 40px rgba(0,0,0,0.1)',
    padding: 20,
  },
  formContainer: {
    maxWidth: 380,
    width: '100%',
    padding: 30,
  },
  title: {
    marginBottom: 24,
    color: '#007bff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 28,
  },
  label: {
    display: 'block',
    marginBottom: 6,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    marginBottom: 18,
    borderRadius: 8,
    border: '1.5px solid #ccc',
    fontSize: 16,
    transition: 'all 0.3s ease',
  },
  inputFocus: {
    borderColor: '#007bff',
    boxShadow: '0 0 6px rgba(0, 123, 255, 0.3)',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px 0',
    background: 'linear-gradient(90deg, #007bff, #00c6ff)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.4)',
  },
  error: {
    color: '#d9534f',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  signUpButton: {
    marginTop: 15,
    width: '100%',
    padding: '12px 0',
    background: 'linear-gradient(90deg, #28a745, #5fd068)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  signUpButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(40, 167, 69, 0.4)',
  },
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [inputFocused, setInputFocused] = useState({ email: false, password: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:8000/api/login/login', {
        Email: email,
        Password: password,
      });

      const user = res.data.user;
      localStorage.setItem('user', JSON.stringify(user));

      setEmail('');
      setPassword('');

      switch (user.Role) {
        case 'Operation':
          navigate('/operacDash');
          break;
        case 'Procurement':
          navigate('/procDash');
          break;
        case 'Field Chief':
          navigate('/FC_Dash');
          break;
        case 'M_D':
          navigate('/MD_Dash');
          break;
        case 'Admin':
          navigate('/Admin');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/AdminDash');
  };

  return (
    <div style={styles.container}>
      {/* Left Pane */}
      <div style={styles.leftPane}>
        <div style={styles.logo}>🚀 WELCOME TO AMAHIRWE MEZA Ltd</div>
        <div style={styles.slogan}>
          Empowering your business with seamless operations and modern solutions.
        </div>
      </div>

      {/* Right Pane */}
      <div style={styles.rightPane}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Sign In</h2>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              style={{
                ...styles.input,
                ...(inputFocused.email ? styles.inputFocus : {}),
              }}
              onFocus={() => setInputFocused(prev => ({ ...prev, email: true }))}
              onBlur={() => setInputFocused(prev => ({ ...prev, email: false }))}
              placeholder="you@example.com"
            />

            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
              style={{
                ...styles.input,
                ...(inputFocused.password ? styles.inputFocus : {}),
              }}
              onFocus={() => setInputFocused(prev => ({ ...prev, password: true }))}
              onBlur={() => setInputFocused(prev => ({ ...prev, password: false }))}
              placeholder="Enter your password"
            />

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(hoveredBtn === 'login' ? styles.buttonHover : {}),
              }}
              onMouseEnter={() => setHoveredBtn('login')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              Login
            </button>
          </form>

          {/* <button
            onClick={handleSignUpRedirect}
            style={{
              ...styles.signUpButton,
              ...(hoveredBtn === 'signup' ? styles.signUpButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredBtn('signup')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            Sign Up
          </button> */}
        </div>
      </div>
    </div>
  );
}
