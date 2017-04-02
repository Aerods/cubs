import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import Login from './pages/Login';
import Apply from './pages/Apply';
import Cubs from './pages/Cubs';
import PackStats from './pages/PackStats';
import ViewCub from './pages/ViewCub'
import CubForm from './pages/CubForm'
import ApplyForm from './pages/ApplyForm'
import Parents from './pages/Parents';
import ParentForm from './pages/ParentForm';
import Leaders from './pages/Leaders';
import ViewLeader from './pages/ViewLeader'
import LeaderForm from './pages/LeaderForm';
import Badges from './pages/Badges';
import ViewBadge from './pages/ViewBadge';
import BadgeForm from './pages/BadgeForm';
import Programme from './pages/Programme';
import ProgrammeForm from './pages/ProgrammeForm';
import ProgrammePrint from './pages/ProgrammePrint';
import AwardBadges from './pages/AwardBadges';
import BadgeProgress from './pages/BadgeProgress';
import TopBar from './components/TopBar';
import Cookies from './cookies.js';
import cookie from 'react-cookie';

var MainLayout = React.createClass({
    render: function() {
        var path = this.props.location.pathname.split('/');
        if (!Cookies.token && path[0] != 'apply') browserHistory.push('/login');
        return (
            <div id="MainLayout" className={ 'section-'+Cookies.section }>
                <TopBar path={ path } />
                { this.props.children }
            </div>
        )
    }
});

ReactDOM.render((
    <Router history={ browserHistory }>
        <Route path="/login" component={ Login } />
        <Route path="/apply" component={ Apply } />
        <Route path="/apply/:apply" component={ ApplyForm } />
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
            <Route path="/leaders/:id" component={ ViewLeader } />
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
