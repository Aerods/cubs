import React from 'react';
import { Link, browserHistory } from 'react-router';
import * as actions from '../Actions';
import Store from '../store';
import CriteriaList from '../components/CriteriaList';
import Modal from '../widgets/Modal';
import CriteriaForm from '../components/CriteriaForm';
import SelectInput from '../widgets/SelectInput';
import ValidationError from '../widgets/ValidationError';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

var BadgeForm = React.createClass({
    getDefaultProps: function() {
      return {
          params: { id: null }
      }
    },
    getInitialState: function() {
      return {
          dataType: 'badge',
          id: this.props.params.id,
          name: '',
          type: '',
          stage: '',
          image: '',
          badge_criteria: [],
          criteria: null,
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
        var self = this;
        if (this.props.params.id) {
            store.onChange({ dataType: 'badge', id: this.props.params.id }, function(badges) {
                var badge = badges[0];
                self.setState({
                    name: badge.name,
                    type: badge.type,
                    stage: badge.stage,
                    image: badge.image
                });
            });
            store.onChange({ dataType: 'criteria', badge_id: this.props.params.id }, function(badge_criteria) {
                badge_criteria.map(function(criteria, cKey) {
                    criteria.uuid = cKey + 1;
                    var criteriaWithTasks = self.state.badge_criteria;
                    store.onChange({ dataType: 'task', badge_criteria_id: criteria.id }, function(badge_tasks) {
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

    validateBadge: function(data) {
        var err = {};
        if (!data.name) err.name = 'Please enter the name of the badge';
        if (!data.type) err.type = 'Please select the type of badge';
        if (data.type == 'Staged' && !data.stage) err.stage = 'Please enter the stage of the badge';
        this.setState({ validation: err });
        return Object.keys(err).length;
    },

    saveBadge: function(e) {
        e.preventDefault();
        var badge = this.state;
        var errors = this.validateBadge(badge);
        if (!errors) {
            if (this.props.params.id) {
                actions.update(badge, function(data) {
                    browserHistory.push('/badges/'+data.id);
                });
            } else {
                actions.add(badge, function(data) {
                    browserHistory.push('/badges/'+data.id);
                });
            }
        }
    },

    addCriteria: function(criteria) {
        var badge_criteria = this.state.badge_criteria;
        if (criteria) {
            if (criteria.uuid) {
                var unchangedBadgeCriteria = [];
                badge_criteria.map(function(unchangedCriteria) {
                    if (unchangedCriteria.uuid != criteria.uuid) { unchangedBadgeCriteria.push(unchangedCriteria); }
                });
                badge_criteria = unchangedBadgeCriteria;
            } else {
                criteria.uuid = badge_criteria.length + 1;
            }
            badge_criteria.push(criteria);
        }
        this.setState({
            isFormOpen: false,
            badge_criteria: badge_criteria
        });
    },

    editCriteria: function(criteria) {
        this.setState({ criteria: criteria });
        this.openForm();
    },
    openForm: function() {
        this.setState({ isFormOpen: true });
    },
    closeForm: function() {
        this.setState({ isFormOpen: false });
        this.setState({ criteria: null });
    },

    render: function() {
        return(
            <div id="BadgeForm">
                <SubHeader heading={ this.props.params.id ? 'Edit badge' : 'New badge' }>
                    <Link to={ this.props.params.id ? "/badges/"+this.props.params.id : "/badges" }><span className="nav-button">back</span></Link>
                    <a><span className="nav-button" onClick={ this.saveBadge }>Save</span></a>
                </SubHeader>

                <PageContent>
                    <div className="form badge-form" onSubmit={ this.saveBadge }>
                        <h3>Badge details</h3>
                        { this.state.image ? <img className="badge-image" src={ "http://localhost:8080/images/badges/"+this.state.image } /> : '' }

                        <div className="form-group">
                            <label className="control-label" htmlFor="name">Name:</label>
                            <input type="text" className="form-control" id="name" name="name" value={ this.state.name } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.name } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="type">Type:</label>
                            <SelectInput
                                data={ ['Core', 'Activity', 'Staged', 'Challenge'] }
                                selected={ this.state.type }
                                name="type"
                                onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.type } />
                        </div>
                        { this.state.type == 'Staged' ? <div className="form-group">
                            <label className="control-label" htmlFor="stage">Stage:</label>
                            <input type="text" className="form-control" id="stage" name="stage" value={ this.state.stage } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.stage } />
                        </div> : '' }
                        <div className="form-group">
                            <label className="control-label" htmlFor="stage">Image:</label>
                            <input type="text" className="form-control" id="image" name="image" value={ this.state.image } onChange={ this.handleInputChange } />
                        </div>

                        <h3>Badge criteria</h3>

                        <div className="form-buttons">
                            <a><span className="nav-button" onClick={ this.openForm }>Add</span></a>
                        </div>

                        <Modal isOpen={this.state.isFormOpen}>
                            <CriteriaForm onClose={ this.closeForm } onSave={ this.addCriteria } criteria={ this.state.criteria } />
                        </Modal>

                        <CriteriaList badge_criteria={ this.state.badge_criteria } onClick={ this.editCriteria } />
                    </div>
                </PageContent>
            </div>
        )
    }
})

export default BadgeForm;
