import React from 'react';
import { Link, browserHistory } from 'react-router';
import CriteriaList from './CriteriaList';
import * as actions from '../Actions';
import Store from '../store';
import Cookies from '../cookies.js';

export default class BadgeDisplay extends React.Component {
    constructor() {
        super();
        this.setBadges = this.setBadges.bind(this);
        this.setCriteria = this.setCriteria.bind(this);
        this.setTasks = this.setTasks.bind(this);
        this.state = {
            dataType: 'badge',
            name: '',
            type: '',
            stage: '',
            image: '',
            badge_criteria: [],
            criteria: null,
            isFormOpen: false,
            validation: {},
            dataChanged: false
        };
    }

    componentWillMount() {
        actions.get({ dataName: 'badgeDisplay', dataType: 'badge', id: this.props.id });
        Store.on('badgeDisplay-get', this.setBadges);

        actions.get({ dataType: 'criteria', badge_id: this.props.id, cub_id: this.props.cub_id });
        Store.on('criteria-get', this.setCriteria);
        Store.on('task-get', this.setTasks);
    }

    componentWillUnmount() {
        Store.removeListener('badgeDisplay-get', this.setBadges);
        Store.removeListener('criteria-get', this.setCriteria);
        Store.removeListener('task-get', this.setTasks);
    }

    setBadges() {
        var badge = Store.data[0];
        this.setState({
            name: badge.name,
            type: badge.type,
            stage: badge.stage,
            image: badge.image
        });
    }

    setCriteria() {
        var badge_criteria = Store.data.map( (criteria, cKey) => {
            criteria.uuid = cKey + 1;
            criteria.badge_tasks = [];
            actions.get({ dataType: 'task', badge_criteria_id: criteria.id, cub_id: this.props.cub_id });
            return criteria;
        });
        this.setState({ badge_criteria: badge_criteria });
    }

    setTasks() {
        criteriaWithTasks = this.state.badge_criteria;
        var badge_tasks = Store.data;

        var tasks = badge_tasks.map(function(task, tKey) {
            task.uuid = tKey + 1;
            return task;
        });

        var criteriaWithTasks = this.state.badge_criteria.map( (criteria) => {
            if (criteria.id == tasks[0].badge_criteria_id) criteria.badge_tasks = tasks;
            return criteria;
        });

        this.setState({ badge_criteria: criteriaWithTasks });
    }

    clickCriteria(criteria) {
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
        this.setState({ badge_criteria: new_badge_criteria, dataChanged: true });
        var data = {
            badge_criteria: new_badge_criteria,
            cubs: [{ id: this.props.cub_id, selected: 1 }],
            dataType: 'activity',
            deleteUnselected: true
        };
        actions.add(data);
    }

    clickTask(task) {
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
        this.setState({ badge_criteria: new_badge_criteria, dataChanged: true });
        var data = {
            badge_criteria: new_badge_criteria,
            cubs: [{ id: this.props.cub_id, selected: 1 }],
            dataType: 'activity',
            deleteUnselected: true
        };
        actions.add(data);
    }

    close() {
        this.props.closeModal(this.state.dataChanged);
    }

    render() {
        return(
            <div id="BadgeDisplay">
                <div className="view-group">
                    <h3>Badge details</h3>
                    { this.props.closeModal ? <a><span className="nav-button" onClick={ this.close.bind(this) }>Close</span></a> : '' }
                    { !this.props.closeModal && Cookies.admin ? (<Link to={ "/badges/"+this.props.id+"/edit" }><span className="nav-button">Edit</span></Link>) : '' }

                    <div className="view-row">
                        <div className="view-image">
                            <img src={ Cookies.host+'/images/badges/'+this.state.image } />
                        </div>
                        <div className="view-col">
                            <div className="field-group">
                                <div className="field-name">Name:</div>
                                <div className="field-value">{ this.state.name + (this.state.type == 'Staged' ? ' - stage ' + this.state.stage : '') }</div>
                            </div>
                            <div className="field-group">
                                <div className="field-name">Type:</div>
                                <div className="field-value">{ this.state.type }</div>
                            </div>
                        </div>
                    </div>
                    <div className="spacer"></div>

                    <h3>Badge criteria</h3>
                    { this.props.cub_id ?
                        <CriteriaList badge_criteria={ this.state.badge_criteria }
                            clickCriteria={ this.clickCriteria.bind(this) }
                            clickTask={ this.clickTask.bind(this) } />
                    :
                        <CriteriaList badge_criteria={ this.state.badge_criteria } />
                    }
                </div>
            </div>
        )
    }
}
