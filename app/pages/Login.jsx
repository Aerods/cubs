import React from 'react';
import { browserHistory, Link } from 'react-router';
import Cookies from '../cookies.js';
import cookie from 'react-cookie';
var actions = require('../Actions');

var Login = React.createClass({
    getInitialState: function() {
        return {
            username: '',
            password: ''
        }
    },

    submitLogin: function() {
        var user = {
            dataType: 'login',
            username: this.state.username,
            password: this.state.password
        };
        actions.update(user, function(data) {
            if (data.result == 'success') {
                Cookies.token = data.token;
                cookie.save('token', data.token);
                browserHistory.push('/');
            }
        });
    },

    handleInputChange: function(e) {
      var name = e.target.name;
      var state = this.state;
      state[name] = e.target.value;
      this.setState(state);
    },

    render: function() {
        return (
            <div id="Login">
                <div className="login-box">
                    <h3>Login</h3>
                    <div className="form-group">
                        <label className="control-label" htmlFor="username">Username:</label>
                        <input type="text" className="form-control" id="username" name="username" value={ this.state.username } onChange={ this.handleInputChange } />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="password">Password:</label>
                        <input type="password" className="form-control" id="password" name="password" value={ this.state.password } onChange={ this.handleInputChange } />
                    </div>
                    <div className="nav-button" onClick={ this.submitLogin }>Login</div>
                </div>
            </div>
        )
    }
});

export default Login;
