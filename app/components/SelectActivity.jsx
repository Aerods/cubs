import React from 'react';
var store = require('../store');
var actions = require('../Actions');
import SelectBadge from './SelectBadge';
import Modal from '../widgets/Modal';
import CriteriaList from './CriteriaList';
import DataTable from '../widgets/DataTable';

var SelectActivity = React.createClass({
    getDefaultProps: function() {
        return {
            addActivity: null,
            closeModal: null
        }
    },

    getInitialState: function() {
        return {
            isModalOpen: false,
            badges: [],
            badge_criteria: [],
            cubs: [],
            badge: {}
        }
    },

    componentDidMount: function() {
        var self = this;
        store.onChange({ dataType: 'badge' }, function(badges) {
            var badgesWithCriteria = badges.map(function(badge) {
                store.onChange({ dataType: 'criteria', badge_id: badge.id }, function(badge_criteria) {
                    var criteriaWithTasks = badge_criteria.map(function(criteria) {
                        store.onChange({ dataType: 'task', badge_criteria_id: criteria.id }, function(badge_tasks) {
                            var tasks = badge_tasks.map(function(task) {
                                return task;
                            });
                            criteria.badge_tasks = tasks;
                        });
                        return criteria;
                    });
                    badge.badge_criteria = criteriaWithTasks;
                });
                return badge;
            });
            self.setState({ badges: badgesWithCriteria });
        });
        store.onChange({ dataType: 'cub' }, function(cubs) {
            self.setState({ cubs: cubs });
        });
    },

    addBadge: function(badge) {
        this.setState({
            badge: badge,
            badge_criteria: badge.badge_criteria,
            isModalOpen: false
        });
    },

    openModal: function() {
        this.setState({ isModalOpen: true });
    },
    closeModal: function() {
        this.setState({ isModalOpen: false });
    },

    clickCriteria: function(criteria) {
        var badge_criteria = this.state.badge_criteria;
        var new_badge_criteria = [];
        badge_criteria.map(function(b_criteria) {
            if (b_criteria.id == criteria.id) {
                var new_badge_tasks = [];
                b_criteria.badge_tasks.map(function(b_task) {
                    if (b_task.badge_criteria_id == criteria.id) {
                        b_task.selected = !b_criteria.selected;
                    }
                    new_badge_tasks.push(b_task);
                });
                b_criteria.selected = !b_criteria.selected;
                b_criteria.badge_tasks = new_badge_tasks;
            }
            new_badge_criteria.push(b_criteria);
        });
        this.setState({ badge_criteria: new_badge_criteria });
    },

    clickTask: function(task) {
        var badge_criteria = this.state.badge_criteria;
        var new_badge_criteria = [];
        var allSelected = 1;
        var xSelected = 0;
        badge_criteria.map(function(b_criteria) {
            var new_badge_tasks = [];
            if (task.badge_criteria_id == b_criteria.id) {
                b_criteria.badge_tasks.map(function(b_task) {
                    if (b_task.id == task.id) {
                        b_task.selected = !b_task.selected;
                    }
                    if (!b_task.selected) allSelected = 0;
                    else xSelected ++;
                    new_badge_tasks.push(b_task);
                });
                b_criteria.selected = allSelected;
                if (b_criteria.complete_x && xSelected >= b_criteria.complete_x) b_criteria.selected = 1;
                b_criteria.badge_tasks = new_badge_tasks;
            }
            new_badge_criteria.push(b_criteria);
        });
        this.setState({ badge_criteria: new_badge_criteria });
    },

    selectCub: function(cub) {
        var cubs = this.state.cubs;
        var new_cubs = [];
        cubs.map(function(new_cub) {
            if (cub.id == new_cub.id) {
                new_cub.selected = !new_cub.selected;
            }
            new_cubs.push(new_cub);
        });
        this.setState({ cubs: new_cubs });
    },

    selectAll: function() {
        var new_cubs = this.state.cubs.map(function(cub) {
            cub.selected = 1;
            return cub;
        });
        this.setState({ cubs: new_cubs });
    },

    deselectAll: function() {
        var new_cubs = this.state.cubs.map(function(cub) {
            cub.selected = 0;
            return cub;
        });
        this.setState({ cubs: new_cubs });
    },

    completeActivity: function() {
        var data = {
            badge_criteria: this.state.badge_criteria,
            cubs: this.state.cubs,
            dataType: 'activity'
        };
        actions.add(data);
        this.props.closeModal();
    },

    render: function() {
        var badgeName;
        var badge = this.state.badge;
        if (badge.name) {
            badgeName = badge.type == 'Staged' ? (<h4>{ badge.name + ' - stage ' + badge.stage }</h4>) : (<h4>{ badge.name }</h4>);
        }
        var headers = {
            forename: 'First name',
            surname: 'Last name',
            date_of_birth: 'Date of birth'
        };
        return(
            <div id="SelectActivity" className="row">
                <h3>Complete activity</h3>
                <div className="spacer" />

                <a><span className="nav-button" onClick={ this.openModal }>{ this.state.badge_criteria.length ? 'Change badge' : 'Select badge' }</span></a>
                <div className="spacer" />
                { badgeName }

                <Modal isOpen={ this.state.isModalOpen }>
                    <SelectBadge badges={ this.state.badges } addBadge={ this.addBadge } closeModal={ this.closeModal } />
                </Modal>

                <div className="select-activity">
                    <CriteriaList
                        badge_criteria={ this.state.badge_criteria }
                        onClick={ function() {} }
                        clickCriteria={ this.clickCriteria }
                        clickTask={ this.clickTask } />
                </div>
                <div className="spacer" />

                <h4>Cubs</h4>
                <div className="spacer" />
                <a><span className="nav-button" onClick={ this.selectAll }>select all</span></a>
                <a><span className="nav-button" onClick={ this.deselectAll }>deselect all</span></a>
                <div className="spacer" />
                <DataTable headers={ headers } data={ this.state.cubs } onClick={ this.selectCub } height="short" />
                <div className="spacer" />

                <a><span className="nav-button" onClick={ this.props.closeModal }>cancel</span></a>
                <a><span className="nav-button" onClick={ this.completeActivity }>complete</span></a>
           </div>
       )
   }
});

export default SelectActivity;
