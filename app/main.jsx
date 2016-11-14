import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import Cubs from './components/Cubs';
import PackStats from './components/PackStats';
import ViewCub from './components/ViewCub'
import CubForm from './components/CubForm'
import Parents from './components/Parents';
import ParentForm from './components/ParentForm';
import Leaders from './components/Leaders';
import LeaderForm from './components/LeaderForm';
import Badges from './components/Badges';
import ViewBadge from './components/ViewBadge';
import BadgeForm from './components/BadgeForm';
import Programme from './components/Programme';
import ProgrammeForm from './components/ProgrammeForm';
import ProgrammePrint from './components/ProgrammePrint';
import AwardBadges from './components/AwardBadges';
import BadgeProgress from './components/BadgeProgress';

var MainLayout = React.createClass({
    render: function() {
        var path = this.props.location.pathname.split('/');
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
