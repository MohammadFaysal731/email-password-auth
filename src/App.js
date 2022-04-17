import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import app from "./firebase.init";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registered, setRegistered] = useState(false);
  const [name, setName] = useState('');

  const handleNameBlur = event => {
    setEmail(event.target.value);
  }
  const handleEmailBlur = event => {
    setName(event.target.value);
  }
  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }

  const handleRegisterChange = event => {
    setRegistered(event.target.checked)
  }


  const handleFormSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError('Password should contain at last one special character');
      return;
    }
    setValidated(true);
    setError('');

    if (registered) {
      console.log(email, password)
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          setSuccess('register success');
          console.log(user);
        })
        .catch(error => {
          console.log(error);
          setError(error.message);
        })

    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          setEmail('');
          setPassword('');
          console.log(user);
          verifyEmail();
          setUserName();
        })
        .catch(error => {
          console.error(error);
          setError(error.message);
        })
    }
    event.preventDefault();
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        console.log('updating name')
      })
      .catch((error) => {
        setError(error.message);
      })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Email verification sent!');

      })
  }

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('email send');
      })
  }


  return (
    <div className="">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="registration w-50 mx-auto mt-5">
        <h2 className="text-primary">Please {registered ? 'Login' : 'Register'}!!</h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          {!registered && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Your Name</Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter your name" required />
            <Form.Control.Feedback type="invalid">
              Please provide your name.
            </Form.Control.Feedback>
          </Form.Group>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisterChange} type="checkbox" label="Already Registered?" />
          </Form.Group>
          <p className="text-success">{success}</p>
          <p className="text-danger">{error}</p>
          <Button onClick={handlePasswordReset} variant="link">Forget Password ?</Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? 'Login' : ' Register'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
