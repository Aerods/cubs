import React from 'react';
import { Link, browserHistory } from 'react-router';
import * as actions from '../Actions';
import Store from '../store';
import DataTable from '../widgets/DataTable';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';
import reactMixin from 'react-mixin';
var OnResize = require("react-window-mixins").OnResize;

export default class BadgeProgress extends React.Component {
    constructor() {
        super();
        this.setCubs = this.setCubs.bind(this);
        this.setBadges = this.setBadges.bind(this);
        this.updateComplete = this.updateComplete.bind(this);
        this.state = {
            cubs: [],
            badges: [],
            hoverCub: null,
            hoverTask: null,
            updating: false
        }
    }

    componentWillMount() {
        actions.get({ dataType: 'cub_tasks' });
        actions.get({ dataType: 'badgesWithCriteria', id: this.props.params.badge_id });
        Store.on('cub_tasks-get', this.setCubs);
        Store.on('badgesWithCriteria-get', this.setBadges);
        Store.on('activity-update', this.updateComplete);
    }

    componentWillUnmount() {
        Store.removeListener('cub_tasks-get', this.setCubs);
        Store.removeListener('badgesWithCriteria-get', this.setBadges);
    }

    setCubs() {
        this.setState({ cubs: Store.data });
    }

    setBadges() {
        this.setState({ badges: Store.data });
    }

    updateComplete() {
        this.setState({ updating: false });
    }

    render() {
        var self = this;
        var cubs = this.state.cubs.map(function(cub, key) {
            var className = "cub-name";
            return (<div key={ key } className={ className }>{ cub.forename + ' ' + cub.surname }</div>);
        });
        var badgeRows = this.state.badges.map(function(badge, key) {
            var badgeName = badge.type == 'Staged' ? badge.name + ' - stage ' + badge.stage : badge.name;

            function compare(a, b) {
                if (a.ordering < b.ordering) return -1;
                if (a.ordering > b.ordering) return 1;
                return 0;
            }
            var criteria = badge.badge_criteria;
            criteria.sort(compare);
            criteria = criteria.map(function(criteria, cKey) {
                var tasks = criteria.badge_tasks;
                tasks.sort(compare);
                tasks = tasks.map(function(task, tKey) {
                    var taskClass = criteria.complete_all ? 'single-task' : 'task';
                    var cells = self.state.cubs.map(function(cub, cellKey) {
                        function handleClick() {
                            if (!self.state.updating) {
                                var cubs = self.state.cubs;
                                cubs[cellKey].badge_tasks[task.id] = !cub.badge_tasks[task.id];
                                self.setState({ cubs: cubs, updating: true });
                                actions.update({ dataType: 'activity', cub: cub, task_id: task.id, mark: cub.badge_tasks[task.id] });
                            }
                        };
                        var cellClass = 'cell';
                        if (cub.badge_tasks[task.id]) cellClass += ' done';
                        return (<div key={ cellKey } className={ cellClass } onClick={ handleClick }></div>);
                    });
                    return (<div key={ tKey }><span className={ taskClass }>{ task.task }</span><div className="cell-row">{ cells }</div><br /></div>);
                });
                if (criteria.complete_all) {
                    return (
                        <div key={ cKey } className="badge-criteria">
                            { tasks }
                        </div>
                    );
                } else {
                    return (
                        <div key={ cKey } className="badge-criteria">
                            <div className="criteria-text">{ criteria.complete_all ? 'Do all' : 'Do '+ criteria.complete_x }</div>
                            { tasks }
                        </div>
                    );
                }
            });
            return (
                <div key={ key } className="badge-row">
                    <div className="badge-details">
                        <div className="badge-name">{ badgeName }</div>
                        { criteria }
                    </div>
                </div>
            );
        });
        return (
            <div id="BadgeProgress">
                <SubHeader heading="Badge progress">
                    <Link to="/badges"><span className="nav-button">Back</span></Link>
                </SubHeader>
                <PageContent>
                    <div className="spacer" />
                    <div className="spacer" />
                    <div className="spacer" />
                    <div className="cub-names">
                        { cubs }
                    </div>
                    <div style={ {height: self.state.window.height-281} } className="badges">
                        { badgeRows }
                    </div>
                </PageContent>
            </div>
        )
    }
}
reactMixin(BadgeProgress.prototype, OnResize);
