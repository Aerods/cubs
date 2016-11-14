import React from 'react';
import ValidationError from '../widgets/ValidationError';
var actions = require('../Actions');
var store = require('../store');

var TaskForm = React.createClass({
    getDefaultProps: function() {
      return {
          task: null,
          onSave: null,
          onClose: null
      }
    },
    getInitialState: function() {
      return {
          id: null,
          task: '',
          uuid: null,
          validation: {}
      }
    },

    handleInputChange: function(e) {
      e.preventDefault();
      var name = e.target.name;
      var state = this.state;
      state[name] = e.target.value;
      state.validation[name] = '';
      this.setState(state);
    },

    componentDidMount: function() {
        if (this.props.task) {
            var task = this.props.task;
            this.setState({
                id: task.id,
                task: task.task,
                uuid: task.uuid
            });
        }
    },

    validateTask: function(data) {
        var err = {};
        if (!data.task) err.task = 'Please enter a task';
        this.setState({ validation: err });
        return Object.keys(err).length;
    },

    saveTask: function(e) {
        e.preventDefault();
        var task = this.state;
        var errors = this.validateTask(task);
        if (!errors) this.props.onSave(task);
    },

    deleteTask: function(e) {
        e.preventDefault();
        var task = this.state;
        task.deleted = 1;
        this.props.onSave(task);
    },

    render: function() {
        return(
            <div id="TaskForm">

                <div className="form" onSubmit={ this.saveTask }>
                    <h3>Task details</h3>
                    <div className="form-group">
                        <label className="control-label" htmlFor="task">Task:</label>
                        <textarea type="text" className="form-control" id="task" name="task" value={ this.state.task } onChange={ this.handleInputChange } />
                        <ValidationError error={ this.state.validation.task } />
                    </div>

                    <div className="form-buttons">
                        <a><span className="nav-button" onClick={ this.props.onClose }>Cancel</span></a>
                        { this.props.task ? <span className="nav-button" onClick={ this.deleteTask }>Delete</span> : '' }
                        <a><span className="nav-button" onClick={ this.saveTask }>Save</span></a>
                    </div>
                </div>
            </div>
        )
    }
})

export default TaskForm;
