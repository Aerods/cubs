import React from 'react';
import { browserHistory, Link } from 'react-router';
import Cookies from '../cookies.js';
import cookie from 'react-cookie';
var OnResize = require("react-window-mixins").OnResize;
var actions = require('../Actions');
var moment = require('moment');

var Login = React.createClass({
    mixins: [ OnResize ],

    getInitialState: function() {
        return {
            username: '',
            password: ''
        }
    },

    submitLogin: function(e) {
        e.preventDefault();
        var user = {
            dataType: 'login',
            username: this.state.username,
            password: this.state.password
        };
        actions.update(user, function(data) {
            if (data.result == 'success') {
                Cookies.token = data.token;
                Cookies.leader_id = data.leader_id;
                var cookieExpiry = moment().add(2, 'days').toDate();
                cookie.save('token', data.token, { expires: cookieExpiry });
                cookie.save('leader_id', data.leader_id, { expires: cookieExpiry });
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
            <div id="Login" style={ {height:this.state.window.height} }>
                <form className="login-box" onSubmit={ this.submitLogin }>
                    <h3>Login</h3>
                    <div className="form-group">
                        <label className="control-label" htmlFor="username">Username:</label>
                        <input type="text" className="form-control" id="username" name="username" value={ this.state.username } onChange={ this.handleInputChange } />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="password">Password:</label>
                        <input type="password" className="form-control" id="password" name="password" value={ this.state.password } onChange={ this.handleInputChange } />
                    </div>
                    <input className="hidden" type="submit" />
                    <div className="nav-button" onClick={ this.submitLogin }>Login</div>
                </form>
            </div>
        )
    }
});

export default Login;
