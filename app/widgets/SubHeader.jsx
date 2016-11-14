import React from 'react';
import { Link, browserHistory } from 'react-router';

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

    render: function () {
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
                        </div>
                    </div>
                ) : (
                    <i className="fa fa-bars hidden-sm hidden-md hidden-lg" onClick={ this.showSidebar }></i>
                ) }
                <span className="heading">{ this.props.heading }</span>
                { this.props.children }
            </div>
        );
    }
});
export default SubHeader;
