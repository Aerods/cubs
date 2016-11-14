import React from 'react';
import { Link, browserHistory } from 'react-router';
var actions = require('../Actions');
var store = require('../store');
import DataTable from '../widgets/DataTable';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';
var OnResize = require("react-window-mixins").OnResize;

var BadgeProgress = React.createClass({
    mixins: [ OnResize ],
    getDefaultProps: function() {
      return {
          params: { badge_id: null }
      }
    },
    getInitialState: function() {
        return {
            cubs: [],
            badges: [],
            hoverCub: null,
            hoverTask: null
        }
    },

    componentDidMount: function() {
        var self = this;
        store.onChange({ dataType: 'cub_tasks' }, function(cubs) {
            if (self.isMounted()) self.setState({ cubs: cubs });
            store.onChange({ dataType: 'badge', id: self.props.params.badge_id, purpose: 'progress' }, function(badges) {
                var badgesWithCriteria = [];
                badges.map(function(badge, bKey) {
                    badge.badge_criteria = [];
                    store.onChange({ dataType: 'criteria', badge_id: badge.id }, function(badge_criteria) {
                        badge_criteria.map(function(criteria, cKey) {
                            store.onChange({ dataType: 'task', badge_criteria_id: criteria.id }, function(badge_tasks) {
                                criteria.badge_tasks = badge_tasks;
                                badge.badge_criteria.push(criteria);
                                if (cKey+1 == badge_criteria.length) badgesWithCriteria.push(badge);
                                if (bKey+1 == badges.length && cKey+1 == badge_criteria.length) self.setState({ badges: badgesWithCriteria });
                            });
                        });
                    });
                });
            });
        });
    },

    render: function() {
        var self = this;
        var cubs = this.state.cubs.map(function(cub, key) {
            var className = "cub-name";
            return (<div key={ key } className={ className }>{ cub.forename + ' ' + cub.surname }</div>);
        });
        var badgeRows = this.state.badges.map(function(badge, key) {
            var badgeName = badge.type == 'Staged' ? badge.name + ' - stage ' + badge.stage : badge.name;
            var criteria = badge.badge_criteria.map(function(criteria, cKey) {
                var tasks = criteria.badge_tasks.map(function(task, tKey) {
                    var taskClass = criteria.complete_all ? 'single-task' : 'task';
                    var cells = self.state.cubs.map(function(cub, cellKey) {
                        function handleClick() {
                            var cubs = self.state.cubs;
                            cubs[cellKey].badge_tasks[task.id] = !cub.badge_tasks[task.id];
                            self.setState({ cubs: cubs });
                            actions.update({ dataType: 'activity', cub: cub, task_id: task.id, mark: cub.badge_tasks[task.id] });
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
});

export default BadgeProgress;
