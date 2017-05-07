import React from 'react';
import { Link, browserHistory } from 'react-router';
import Cookies from '../cookies.js';
import cookie from 'react-cookie';
import * as actions from '../Actions';
import Store from '../store';

export default class TopBar extends React.Component {
    constructor() {
        super();
        this.setCubs = this.setCubs.bind(this);
        this.state = {
            cubs: []
        };
    }
    componentWillMount() {
        actions.get({ dataName: 'parentCubs', dataType: 'cub' });
        Store.on('parentCubs-get', this.setCubs);
    }
    componentWillUnmount() {
        Store.removeListener('parentCubs-get', this.setCubs);
    }
    setCubs() {
        this.setState({ cubs: Store.data });
    }
    logout() {
        Cookies.token = '';
        cookie.remove('token');
        cookie.remove('leader_id');
        cookie.remove('parent_id');
        cookie.remove('section');
        browserHistory.push('/login');
    }

    render() {
        var path = this.props.path;
        // if (Cookies.parent_id) {
        //     var cubs = this.state.cubs.map(function(cub, key) {
        //         return (<Link className={ "topbar-nav" + ((path[1] == 'cubs' || !path[1]) ? ' active' : '') } to={"/cubs/"+cub.id}>{ cub.forename }</Link>);
        //     });
        //     return (
        //         <div className="topbar hidden-xs">
        //             <Link className="topbar-brand" to="/">{ Cookies.member } Database</Link>
        //             { cubs }
        //             <Link className={ "topbar-nav" + (path[1] == 'leaders' ? ' active' : '') } to="/leaders">Leaders</Link>
        //             <Link className={ "topbar-nav" + (path[1] == 'programme' ? ' active' : '') } to="/programme">Programme</Link>
        //             <div className="grow" />
        //             <div className="topbar-nav" onClick={ this.logout }>Log out</div>
        //         </div>);
        // } else {
            return (
                <div className="topbar hidden-xs">
                    <Link className="topbar-brand" to="/">{ Cookies.member } Database</Link>
                    <Link className={ "topbar-nav" + ((path[1] == 'cubs' || !path[1]) ? ' active' : '') } to="/cubs">{ Cookies.section }</Link>
                    <Link className={ "topbar-nav" + (path[1] == 'parents' ? ' active' : '') } to="/parents">Parents</Link>
                    <Link className={ "topbar-nav" + (path[1] == 'leaders' ? ' active' : '') } to="/leaders">Leaders</Link>
                    <Link className={ "topbar-nav" + (path[1] == 'badges' ? ' active' : '') } to="/badges">Badges</Link>
                    <Link className={ "topbar-nav" + (path[1] == 'programme' ? ' active' : '') } to="/programme">Programme</Link>
                    { Cookies.admin ? <Link className={ "topbar-nav" + (path[1] == 'award' ? ' active' : '') } to="/award">Award</Link> : '' }
                    <div className="grow" />
                    <div className="topbar-nav hidden-sm" onClick={ this.logout }>Log out</div>
                </div>);
        // }
    }
}
