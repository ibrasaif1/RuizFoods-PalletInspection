import React, { Component } from 'react'
import axios from 'axios';

export default class SignUp extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    error: '',
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: 'Passwords do not match'});
      return;
    }

    // Validate email format and domain
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(this.state.email)) {
      this.setState({ error: 'Please enter a valid ruizfoods.com email address'});
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/register', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
      });
      alert(response.data);
    } catch (error) {
      this.setState({ error: 'An error occurred. Please try again.'});
    }
  };

  togglePasswordVisibility = () => {
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Sign Up</h3>
        <div className="mb-3">
          <label>First name</label>
          <input 
            type="text"
            className="form-control"
            name="firstName"
            value={this.state.firstName}
            onChange={this.handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Last name</label>
          <input 
            type="text" 
            className="form-control"
            name="lastName"
            value={this.state.lastName}
            onChange={this.handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type={this.state.showPassword ? 'text' : 'password'}
            className="form-control"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <input
            type="checkbox"
            onChange={this.togglePasswordVisibility}
          /> Show Password
        </div>
        <div className="mb-3">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={this.state.confirmPassword}
            onChange={this.handleChange}
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
        <p className="forgot-password text-right">
          Already registered? <a href="/log-in">Sign in</a>
        </p>
      </form>
    )
  }
}