import React from 'react';
import { Link, browserHistory } from 'react-router';
import Cookies from '../cookies.js';
import cookie from 'react-cookie';

var SubHeader = React.createClass({
    getDefaultProps: function() {
        return {
            heading: '',
        }
    },
    getInitialState: function() {
      return { sidebar: false }
    },
    showSidebar: function () {
        this.setState({ sidebar: true });
    },
    hideSidebar: function () {
        this.setState({ sidebar: false });
    },
    logout: function () {
        Cookies.token = '';
        cookie.remove('token');
        browserHistory.push('/login');
    },

    render: function () {
        var loggedIn = (Cookies.leader_id || Cookies.parent_id ? 1 : 0);
        return (
            <div className="SubHeader">
                { this.state.sidebar ? (
                    <div>
                        <i className="fa fa-times hidden-sm hidden-md hidden-lg" onClick={ this.hideSidebar }></i>
                        <div className="sidebar hidden-sm hidden-md hidden-lg">
                            <Link className="sidebar-nav" to="/cubs">Cubs</Link>
                            <Link className="sidebar-nav" to="/parents">Parents</Link>
                            <Link className="sidebar-nav" to="/leaders">Leaders</Link>
                            <Link className="sidebar-nav" to="/badges">Badges</Link>
                            <Link className="sidebar-nav" to="/programme">Programme</Link>
                            <Link className="sidebar-nav" to="/award">Award</Link>
                            <div className="sidebar-nav" onClick={ this.logout }>Log out</div>
                        </div>
                    </div>
                ) :
                    (loggedIn ? (<i className="fa fa-bars hidden-sm hidden-md hidden-lg" onClick={ this.showSidebar }></i>) : '')
                }
                <span className="heading">{ this.props.heading }</span>
                { this.props.children }
            </div>
        );
    }
});
export default SubHeader;
