import React from 'react';
import { browserHistory, Link } from 'react-router';
import Cookies from '../cookies.js';
import cookie from 'react-cookie';
import FormGroup from '../widgets/FormGroup';
import moment from 'moment';
import * as actions from '../Actions';
import Store from '../store';
import reactMixin from 'react-mixin';
var OnResize = require("react-window-mixins").OnResize;

export default class Login extends React.Component {
    constructor() {
        super();
        this.login = this.login.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            username: '',
            password: ''
        };
    }

    submitLogin(e) {
        e.preventDefault();
        var user = {
            dataType: 'login',
            username: this.state.username,
            password: this.state.password
        };
        actions.update(user);
        Store.on('login-update', this.login);
    }

    login() {
        var data = Store.data;
        if (data.result == 'success') {
            var member = data.section.substring(0, data.section.length-1);
            Cookies.token = data.token;
            Cookies.leader_id = data.leader_id;
            Cookies.section = data.section;
            Cookies.group = data.group;
            Cookies.member = member;
            var cookieExpiry = moment().add(2, 'days').toDate();
            cookie.save('token', data.token, { expires: cookieExpiry });
            cookie.save('leader_id', data.leader_id, { expires: cookieExpiry });
            cookie.save('section', data.section, { expires: cookieExpiry });
            cookie.save('group', data.group, { expires: cookieExpiry });
            cookie.save('member', member, { expires: cookieExpiry });
            browserHistory.push('/');
        }
    }

    handleInputChange(e) {
      var name = e.target.name;
      var state = this.state;
      state[name] = e.target.value;
      this.setState(state);
    }

    render() {
        return (
            <div id="Login" style={ {height:this.state.window.height} }>
                <form className="login-box" onSubmit={ this.submitLogin.bind(this) }>
                    <h3>Login</h3>
                    <FormGroup name="username" label="Username:" value={ this.state.username } onChange={ this.handleInputChange } />
                    <FormGroup name="password" label="Password:" value={ this.state.password } onChange={ this.handleInputChange } type="password" />
                    <input className="hidden" type="submit" />
                    <div className="nav-button" onClick={ this.submitLogin.bind(this) }>Login</div>
                </form>
            </div>
        )
    }
}
reactMixin(Login.prototype, OnResize);
