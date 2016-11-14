import React from 'react';
import { Link, browserHistory } from 'react-router';
import CriteriaList from './CriteriaList';
var actions = require('../Actions');
var store = require('../store');

var BadgeDisplay = React.createClass({
    getDefaultProps: function() {
      return {
          id: null,
          closeModal: null,
          cub_id: null
      }
    },
    getInitialState: function() {
      return {
          dataType: 'badge',
          id: this.props.id,
          name: '',
          type: '',
          stage: '',
          image: '',
          badge_criteria: [],
          criteria: null,
          isFormOpen: false,
          validation: {},
          dataChanged: false

      }
    },

    componentDidMount: function() {
        var self = this;
        if (this.props.id) {
            store.onChange({ dataType: 'badge', id: this.props.id }, function(badges) {
                var badge = badges[0];
                self.setState({
                    name: badge.name,
                    type: badge.type,
                    stage: badge.stage,
                    image: badge.image
                });
            });
            store.onChange({ dataType: 'criteria', badge_id: this.props.id, cub_id: self.props.cub_id }, function(badge_criteria) {
                badge_criteria.map(function(criteria, cKey) {
                    criteria.uuid = cKey + 1;
                    var criteriaWithTasks = self.state.badge_criteria;
                    store.onChange({ dataType: 'task', badge_criteria_id: criteria.id, cub_id: self.props.cub_id }, function(badge_tasks) {
                        var tasks = badge_tasks.map(function(task, tKey) {
                            task.uuid = tKey + 1;
                            return task;
                        });
                        criteria.badge_tasks = tasks;
                        criteriaWithTasks.push(criteria);
                        self.setState({ badge_criteria: criteriaWithTasks });
                    });
                });
            });
        }
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
        this.setState({ badge_criteria: new_badge_criteria, dataChanged: true });
        var data = {
            badge_criteria: new_badge_criteria,
            cubs: [{ id: this.props.cub_id, selected: 1 }],
            dataType: 'activity',
            deleteUnselected: true
        };
        actions.add(data);
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
        this.setState({ badge_criteria: new_badge_criteria, dataChanged: true });
        var data = {
            badge_criteria: new_badge_criteria,
            cubs: [{ id: this.props.cub_id, selected: 1 }],
            dataType: 'activity',
            deleteUnselected: true
        };
        actions.add(data);
    },

    close: function() {
        this.props.closeModal(this.state.dataChanged);
    },

    render: function() {
        return(
            <div id="BadgeDisplay">
                <div className="view-group">
                    <h3>Badge details</h3>
                    { this.props.closeModal ?
                        <a><span className="nav-button" onClick={ this.close }>Close</span></a> :
                        <Link to={ "/badges/"+this.props.id+"/edit" }><span className="nav-button">Edit</span></Link>
                    }

                    <div className="view-row">
                        <div className="view-image">
                            <img src={ 'http://localhost:8080/images/badges/'+this.state.image } />
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
                            clickCriteria={ this.clickCriteria }
                            clickTask={ this.clickTask } />
                    :
                        <CriteriaList badge_criteria={ this.state.badge_criteria } />
                    }
                </div>
            </div>
        )
    }
})

export default BadgeDisplay
;
