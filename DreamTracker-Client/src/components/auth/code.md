# AuthorizedRoute.jsx
+++javascript
import { Navigate } from "react-router-dom";

// This component returns a Route that either display the prop element
// or navigates to the login. If roles are provided, the route will require
// all of the roles when all is true, or any of the roles when all is false
export const AuthorizedRoute = ({ children, loggedInUser, roles, all }) => {
  let authed = false;
  if (loggedInUser) {
    if (roles && roles.length) {
      authed = all
        ? roles.every((r) => loggedInUser.roles.includes(r))
        : roles.some((r) => loggedInUser.roles.includes(r));
    } else {
      authed = true;
    }
  }

  return authed ? children : <Navigate to="/login" />;
};

+++

# Login.jsx
+++javascript
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../managers/authManager";
import { Button, FormFeedback, FormGroup, Input, Label } from "reactstrap";

export default function Login({ setLoggedInUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password).then((user) => {
      if (!user) {
        setFailedLogin(true);
      } else {
        setLoggedInUser(user);
        navigate("/");
      }
    });
  };

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <h3>Login</h3>
      <FormGroup>
        <Label>Email</Label>
        <Input
          invalid={failedLogin}
          type="text"
          value={email}
          onChange={(e) => {
            setFailedLogin(false);
            setEmail(e.target.value);
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label>Password</Label>
        <Input
          invalid={failedLogin}
          type="password"
          value={password}
          onChange={(e) => {
            setFailedLogin(false);
            setPassword(e.target.value);
          }}
        />
        <FormFeedback>Login failed.</FormFeedback>
      </FormGroup>

      <Button color="primary" onClick={handleSubmit}>
        Login
      </Button>
      <p>
        Not signed up? Register <Link to="/register">here</Link>
      </p>
    </div>
  );
}

+++

# Register.jsx
+++javascript
import { useState } from "react";
import { register } from "../../managers/authManager";
import { Link, useNavigate } from "react-router-dom";
import { Button, FormFeedback, FormGroup, Input, Label } from "reactstrap";

export default function Register({ setLoggedInUser }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordMismatch, setPasswordMismatch] = useState();
  const [registrationFailure, setRegistrationFailure] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      const newUser = {
        firstName,
        lastName,
        userName,
        email,
        address,
        password,
      };
      register(newUser).then((user) => {
        if (user) {
          setLoggedInUser(user);
          navigate("/");
        } else {
          setRegistrationFailure(true);
        }
      });
    }
  };

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <h3>Sign Up</h3>
      <FormGroup>
        <Label>First Name</Label>
        <Input
          type="text"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label>Last Name</Label>
        <Input
          type="text"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label>User Name</Label>
        <Input
          type="text"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label>Address</Label>
        <Input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label>Password</Label>
        <Input
          invalid={passwordMismatch}
          type="password"
          value={password}
          onChange={(e) => {
            setPasswordMismatch(false);
            setPassword(e.target.value);
          }}
        />
      </FormGroup>
      <FormGroup>
        <Label> Confirm Password</Label>
        <Input
          invalid={passwordMismatch}
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setPasswordMismatch(false);
            setConfirmPassword(e.target.value);
          }}
        />
        <FormFeedback>Passwords do not match!</FormFeedback>
      </FormGroup>
      <p style={{ color: "red" }} hidden={!registrationFailure}>
        Registration Failure
      </p>
      <Button
        color="primary"
        onClick={handleSubmit}
        disabled={passwordMismatch}
      >
        Register
      </Button>
      <p>
        Already signed up? Log in <Link to="/login">here</Link>
      </p>
    </div>
  );
}

+++

