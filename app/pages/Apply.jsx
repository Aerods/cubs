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

export default class Apply extends React.Component {
    constructor() {
        super();
        this.login = this.login.bind(this);
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
            browserHistory.push('/');
        }
    }

    applyBeaver() {
        Cookies.section = 'Beavers';
        Cookies.group = 'Tedburn and Cheriton';
        Cookies.member = 'Beaver';
        var cookieExpiry = moment().add(2, 'days').toDate();
        cookie.save('section', 'Beavers', { expires: cookieExpiry });
        cookie.save('group', 'Tedburn and Cheriton', { expires: cookieExpiry });
        cookie.save('member', 'Beaver', { expires: cookieExpiry });
        browserHistory.push('apply/beavers');
    }
    applyCub() {
        Cookies.section = 'Cubs';
        Cookies.group = 'Tedburn and Cheriton';
        Cookies.member = 'Cub';
        var cookieExpiry = moment().add(2, 'days').toDate();
        cookie.save('section', 'Cubs', { expires: cookieExpiry });
        cookie.save('group', 'Tedburn and Cheriton', { expires: cookieExpiry });
        cookie.save('member', 'Cub', { expires: cookieExpiry });
        browserHistory.push('apply/cubs');
    }
    applyScout() {
        Cookies.section = 'Scouts';
        Cookies.group = 'Tedburn and Cheriton';
        Cookies.member = 'Scout';
        var cookieExpiry = moment().add(2, 'days').toDate();
        cookie.save('section', 'Scouts', { expires: cookieExpiry });
        cookie.save('group', 'Tedburn and Cheriton', { expires: cookieExpiry });
        cookie.save('member', 'Scout', { expires: cookieExpiry });
        browserHistory.push('apply/scouts');
    }

    render() {
        return (
            <div id="Apply">
                <div className="title">
                    <div className="group">Tedburn and Cheriton Scout Group</div>
                    <div className="logo"><img src={ Cookies.host+'/images/logo.jpg' } /></div>
                </div>

                <div className="sections">
                    <div className="section">
                        <div className="logo beavers"><img src={ Cookies.host+'/images/beavers-logo.png' } /></div>
                        <div>Age 6 - 8</div>
                        <div>Thursdays 5:45pm - 6:15pm</div>
                        <div className="nav-button" onClick={ this.applyBeaver.bind(this) }>Apply</div>
                    </div>
                    <div className="section">
                        <div className="logo cubs"><img src={ Cookies.host+'/images/cubs-logo.png' } /></div>
                        <div>Age 8 - 10&frac12;</div>
                        <div>Thursdays 6:30pm - 8:00pm</div>
                        <div className="nav-button" onClick={ this.applyCub.bind(this) }>Apply</div>
                    </div>
                    <div className="section">
                        <div className="logo scouts"><img src={ Cookies.host+'/images/scouts-logo.gif' } /></div>
                        <div>Age 10&frac12; - 14</div>
                        <div>Mondays 7:00pm - 9:00pm</div>
                        <div className="nav-button" onClick={ this.applyScout.bind(this) }>Apply</div>
                    </div>
                </div>
            </div>
        )
    }
}
