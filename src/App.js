import React from "react";
import logo from "./logo.svg";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./Firebase.config";
import { useState } from "react";

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
    password: "",
    isValid: false,
    existingUser: false,
  });

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        const { displayName, photoURL, phoneNumber, email } = res.user;
        const singedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
          isValid: true,
        };

        setUser(singedInUser);

        console.log(displayName, photoURL, phoneNumber, email);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const user = {
          isSignedIn: false,
          name: "",
          email: "",
          photo: "",
          password: "",
          error: "",
          isValid: false,
        };

        setUser(user);
      })
      .catch((err) => {});
  };

  // Email Authentication Section

  const is_valid_email = (email) => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = (input) => /\d/.test(input);

  const switchForm = (e) => {
    const createdUser = { ...user };
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  };

  const handleChange = (e) => {
    const newUserInfo = {
      ...user,
    };

    // perform validation
    let isValid = true;
    if (e.target.name === "email") {
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name === "password") {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  };

  const createAccount = (e) => {
    if (user.isValid) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = "";
          setUser(createdUser);
        })
        .catch((err) => {
          console.log(err);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        });
    } else {
      console.log("not working");
    }
    e.target.reset();
    e.preventDefault();
  };

  // SignIn user

  const signInUser = (e) => {
    if (user.isValid) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = "";
          setUser(createdUser);
        })
        .catch((err) => {
          console.log(err);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        });
    } else {
      console.log("not working");
    }
    debugger;
    e.preventDefault();
    e.target.reset();
  };

  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}

      {user.isSignedIn && (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      )}

      <h1>Our Own Authentication</h1>

      <label htmlFor="switchForm">
        Returning User
        <input
          type="checkbox"
          name="switchForm"
          id="switchForm"
          onChange={switchForm}
        />
      </label>
      <form
        style={{ display: user.existingUser ? "block" : "none" }}
        onSubmit={signInUser}
      >
        <input
          onBlur={handleChange}
          type="text"
          name="email"
          placeholder="Your Email.."
          required
        />
        <br />
        <input
          onBlur={handleChange}
          type="password"
          name="password"
          placeholder="Your password.."
          required
        />
        <br />
        <input type="submit" value="SignIN" />
      </form>

      <form
        style={{ display: user.existingUser ? "none" : "block" }}
        onSubmit={createAccount}
      >
        <input
          onBlur={handleChange}
          type="text"
          name="name"
          placeholder="Your Name.."
          required
        />
        <br />
        <input
          onBlur={handleChange}
          type="text"
          name="email"
          placeholder="Your Email.."
          required
        />
        <br />
        <input
          onBlur={handleChange}
          type="password"
          name="password"
          placeholder="Your password.."
          required
        />
        <br />
        <input type="submit" value="Create account" />
      </form>
      {user.error && <p style={{ color: "red" }}>{user.error}</p>}
    </div>
  );
}

export default App;
