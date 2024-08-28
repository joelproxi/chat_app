import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../components/NavBar";

import { registerAction } from "../store/actions/AuthAction";
import { authSelectorState } from "../store/selectors/AuthSelector";
import { Navigate } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(authSelectorState);

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    telephone: "",
    password: "",
    password2: "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
    console.log(data);
  };

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerAction(data) as any);
  };

  if (user) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <NavBar />
      <br />
      {error && <p>{error}</p>}
      <form onSubmit={handleOnSubmit}>
        <div>
          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            placeholder="Last Name"
            onChange={handleOnChange}
            name="first_name"
          />
        </div>
        <div>
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            placeholder="First Name"
            onChange={handleOnChange}
            name="last_name"
          />
        </div>
        <div>
          <label htmlFor="">Email</label>
          <input
            type="email"
            placeholder="Email"
            onChange={handleOnChange}
            name="email"
          />
        </div>

        <div>
          <label htmlFor="">Telephone</label>
          <input
            type="text"
            placeholder="Telephone"
            onChange={handleOnChange}
            name="telephone"
          />
        </div>

        <div>
          <label htmlFor="">Password</label>
          <input
            type="password"
            placeholder="Password"
            onChange={handleOnChange}
            name="password"
          />
        </div>

        <div>
          <label htmlFor="">Password confirm</label>
          <input
            type="password"
            placeholder="Password confirm"
            onChange={handleOnChange}
            name="password2"
          />
        </div>
        {loading ? (
          <button className="btn btn-primary" type="submit" disabled>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>
        ) : (
          <button type="submit">Sigin</button>
        )}
      </form>
    </>
  );
};

export default RegisterPage;
