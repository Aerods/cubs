import React from 'react';
import Modal from '../widgets/Modal';
import TaskForm from './TaskForm';
import ValidationError from '../widgets/ValidationError';

var CriteriaForm = React.createClass({
    getDefaultProps: function() {
      return {
          criteria: null,
          onSave: null,
          onClose: null
      }
    },
    getInitialState: function() {
      return {
          id: null,
          text: '',
          complete_all: '',
          complete_x: '',
          uuid: null,
          badge_tasks: [],
          task: null,
          isFormOpen: false,
          validation: {}
      }
    },

    handleInputChange: function(e) {
      var name = e.target.name;
      var state = this.state;
      state[name] = e.target.value;
      state.validation[name] = '';
      this.setState(state);
    },

    componentDidMount: function() {
        if (this.props.criteria) {
            var criteria = this.props.criteria;
            this.setState({
                id: criteria.id,
                text: criteria.text,
                complete_all: criteria.complete_all,
                complete_x: criteria.complete_x,
                badge_tasks: criteria.badge_tasks,
                uuid: criteria.uuid
            });
        }
    },

    validateCriteria: function(data) {
        var err = {};
        if (data.complete_all === '') err.complete_all = 'Please choose an option';
        if (data.complete_all == 0 && data.complete_all !== '' && !data.complete_x) err.complete_x = 'Please enter a value';
        this.setState({ validation: err });
        return Object.keys(err).length;
    },

    saveCriteria: function(e) {
        e.preventDefault();
        var criteria = this.state;
        var errors = this.validateCriteria(criteria);
        if (!errors) this.props.onSave(criteria);
    },

    deleteCriteria: function(e) {
        e.preventDefault();
        var criteria = this.state;
        criteria.deleted = 1;
        this.props.onSave(criteria);
    },

    addTask: function(task) {
        var badge_tasks = this.state.badge_tasks;
        if (task) {
            if (task.uuid) {
                var unchangedBadgeTasks = [];
                badge_tasks.map(function(unchangedTask) {
                    if (unchangedTask.uuid != task.uuid) { unchangedBadgeTasks.push(unchangedTask); }
                });
                badge_tasks = unchangedBadgeTasks;
            } else {
                task.uuid = badge_tasks.length + 1;
            }
            badge_tasks.push(task);
        }
        this.setState({
            isFormOpen: false,
            badge_tasks: badge_tasks
        });
    },

    editTask: function(task) {
        this.setState({ task: task });
        this.openForm();
    },
    openForm: function() {
        this.setState({ isFormOpen: true });
    },
    closeForm: function() {
        this.setState({ isFormOpen: false });
        this.setState({ task: null });
    },

    render: function() {
        var self = this;
        var tasks = this.state.badge_tasks.map(function(task, key) {
            function clickTask() {
                self.editTask(task);
            }
            if (!task.deleted) return (<li key={ key } onClick={ clickTask }>{ task.task }</li>);
        });
        var completeAllChecked = 0;
        var completeAllNotChecked = 0;
        if (this.state.complete_all == 1) completeAllChecked = 1;
        else if (this.state.complete_all == 0 && this.state.complete_all !== '') completeAllNotChecked = 1;

        var criteriaText;
        if (this.state.text) criteriaText = this.state.text;
        else if (completeAllChecked) criteriaText = 'Complete all of the following:';
        else if (completeAllNotChecked) criteriaText = 'Complete '+ this.state.complete_x +' of the following:';

        return(
            <div id="CriteriaForm">

                <div className="form" onSubmit={ this.saveCriteria }>
                    <h3>Criteria details</h3>
                    <div className="form-group">
                        <label className="control-label" htmlFor="text">Text:</label>
                        <div className="form-radio-buttons">
                            <input type="radio" name="complete_all" value="1" onChange={ this.handleInputChange } checked={ completeAllChecked } /> Complete all<br />
                            <input type="radio" name="complete_all" value="0" onChange={ this.handleInputChange } checked={ completeAllNotChecked } /> Complete some
                        </div>
                        <ValidationError error={ this.state.validation.complete_all } />
                    </div>

                    { completeAllNotChecked ? <div className="form-group">
                        <label className="control-label" htmlFor="text">Complete:</label>
                        <input type="complete_x" className="form-control small" id="complete_x" name="complete_x" value={ this.state.complete_x } onChange={ this.handleInputChange } />
                        <span> of the following</span>
                        <ValidationError error={ this.state.validation.complete_x } />
                    </div> : '' }

                    <div className="form-group">
                        <label className="control-label" htmlFor="text">Text:</label>
                        <input type="text" className="form-control" id="text" name="text" value={ this.state.text } onChange={ this.handleInputChange } />
                        <span> (optional)</span>
                        <ValidationError error={ this.state.validation.text } />
                    </div>

                    <h3>Tasks</h3>

                    <div className="form-buttons">
                        <a><span className="nav-button" onClick={ this.openForm }>Add</span></a>
                    </div>

                    <Modal isOpen={this.state.isFormOpen}>
                        <TaskForm onClose={ this.closeForm } onSave={ this.addTask } task={ this.state.task } />
                    </Modal>

                    { this.state.badge_tasks.length ? <h4>{ criteriaText }</h4> : '' }
                    <ul>{ tasks }</ul>

                    <div className="form-buttons">
                        <a><span className="nav-button" onClick={ this.props.onClose }>Cancel</span></a>
                        { this.props.criteria ? <a><span className="nav-button" onClick={ this.deleteCriteria }>Delete</span></a> : '' }
                        <a><span className="nav-button" onClick={ this.saveCriteria }>Save</span></a>
                    </div>
                </div>
            </div>
        )
    }
})

export default CriteriaForm;
