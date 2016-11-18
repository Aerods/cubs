import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import Login from './pages/Login';
import Cubs from './pages/Cubs';
import PackStats from './pages/PackStats';
import ViewCub from './pages/ViewCub'
import CubForm from './pages/CubForm'
import Parents from './pages/Parents';
import ParentForm from './pages/ParentForm';
import Leaders from './pages/Leaders';
import LeaderForm from './pages/LeaderForm';
import Badges from './pages/Badges';
import ViewBadge from './pages/ViewBadge';
import BadgeForm from './pages/BadgeForm';
import Programme from './pages/Programme';
import ProgrammeForm from './pages/ProgrammeForm';
import ProgrammePrint from './pages/ProgrammePrint';
import AwardBadges from './pages/AwardBadges';
import BadgeProgress from './pages/BadgeProgress';
import Cookies from './cookies.js';

var MainLayout = React.createClass({
    render: function() {
        var path = this.props.location.pathname.split('/');
        if (!Cookies.token) browserHistory.push('/login');
        return (
            <div id="MainLayout">
                <div className="topbar hidden-xs">
                    <Link className="topbar-brand" to="/">Cub Database</Link>
                    <Link className={ "topbar-nav" + ((path[1] == 'cubs' || !path[1]) ? ' active' : '') } to="/cubs">Cubs</Link>
                    <Link className={ "topbar-nav" + (path[1] == 'parents' ? ' active' : '') } to="/parents">Parents</Link>
                    <Link className={ "topbar-nav" + (path[1] == 'leaders' ? ' active' : '') } to="/leaders">Leaders</Link>
                    <Link className={ "topbar-nav" + (path[1] == 'badges' ? ' active' : '') } to="/badges">Badges</Link>
                    <Link className={ "topbar-nav" + (path[1] == 'programme' ? ' active' : '') } to="/programme">Programme</Link>
                    <Link className={ "topbar-nav" + (path[1] == 'award' ? ' active' : '') } to="/award">Award</Link>
                </div>
                { this.props.children }
            </div>
        )
    }
});

ReactDOM.render((
    <Router history={ browserHistory }>
        <Route path="/login" component={ Login } />
        <Route path="/programmePrint/:id" component={ ProgrammePrint } />
        <Route component={ MainLayout }>
            <Route path="/" component={ Cubs } />
            <Route path="/cubs" component={ Cubs } />
            <Route path="/cubs/stats" component={ PackStats } />
            <Route path="/cubs/new" component={ CubForm } />
            <Route path="/cubs/:id" component={ ViewCub } />
            <Route path="/cubs/:id/edit" component={ CubForm } />
            <Route path="/parents" component={ Parents } />
            <Route path="/parents/new" component={ ParentForm } />
            <Route path="/parents/:id/edit" component={ ParentForm } />
            <Route path="/leaders" component={ Leaders } />
            <Route path="/leaders/new" component={ LeaderForm } />
            <Route path="/leaders/:id/edit" component={ LeaderForm } />
            <Route path="/badges" component={ Badges } />
            <Route path="/badges/new" component={ BadgeForm } />
            <Route path="/badges/progress" component={ BadgeProgress } />
            <Route path="/badges/:id" component={ ViewBadge } />
            <Route path="/badges/:id/edit" component={ BadgeForm } />
            <Route path="/badges/:badge_id/progress" component={ BadgeProgress } />
            <Route path="/programme" component={ Programme } />
            <Route path="/programme/new" component={ ProgrammeForm } />
            <Route path="/programme/:id/edit" component={ ProgrammeForm } />
            <Route path="/award" component={ AwardBadges } />
        </Route>
    </Router>
), document.getElementById("root"));
