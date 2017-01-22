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
import Cookies from '../cookies.js';

export default class BadgeForm extends React.Component {
    constructor() {
        super();
        this.setBadge = this.setBadge.bind(this);
        this.setCriteria = this.setCriteria.bind(this);
        this.setTasks = this.setTasks.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            dataType: 'badge',
            name: '',
            type: '',
            stage: '',
            image: '',
            badge_criteria: [],
            criteria: null,
            isFormOpen: false,
            validation: {}
        }
    }

    componentWillMount() {
        if (this.props.params.id) {
            actions.get({ dataName: 'badgeForm', dataType: 'badge', id: this.props.params.id });
            Store.on('badgeForm-get', this.setBadge);

            actions.get({ dataType: 'criteria', badge_id: this.props.params.id });
            Store.on('criteria-get', this.setCriteria);
            Store.on('task-get', this.setTasks);
        }
    }

    componentWillUnmount() {
        Store.removeListener('badgeForm-get', this.setBadge);
        Store.removeListener('criteria-get', this.setCriteria);
        Store.removeListener('task-get', this.setTasks);
    }

    setBadge() {
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

    handleInputChange(e) {
      var name = e.target.name;
      var state = this.state;
      state[name] = e.target.value;
      state.validation[name] = '';
      this.setState(state);
    }

    validateBadge(data) {
        var err = {};
        if (!data.name) err.name = 'Please enter the name of the badge';
        if (!data.type) err.type = 'Please select the type of badge';
        if (data.type == 'Staged' && !data.stage) err.stage = 'Please enter the stage of the badge';
        this.setState({ validation: err });
        return Object.keys(err).length;
    }

    saveBadge(e) {
        e.preventDefault();
        var badge = this.state;
        var errors = this.validateBadge(badge);
        if (!errors) {
            if (this.props.params.id) {
                badge.id = this.props.params.id;
                actions.update(badge);
                Store.on('badge-update', this.navToBadge);
            } else {
                actions.add(badge);
                Store.on('badge-add', this.navToBadge);
            }
        }
    }

    addCriteria(criteria) {
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
    }

    navToBadge() {
        browserHistory.push('/badges/'+Store.data.id);
    }

    editCriteria(criteria) {
        this.setState({ criteria: criteria });
        this.openForm();
    }
    openForm() {
        this.setState({ isFormOpen: true });
    }
    closeForm() {
        this.setState({ isFormOpen: false });
        this.setState({ criteria: null });
    }

    render() {
        return(
            <div id="BadgeForm">
                <SubHeader heading={ this.props.params.id ? 'Edit badge' : 'New badge' }>
                    <Link to={ this.props.params.id ? "/badges/"+this.props.params.id : "/badges" }><span className="nav-button">back</span></Link>
                    <a><span className="nav-button" onClick={ this.saveBadge.bind(this) }>Save</span></a>
                </SubHeader>

                <PageContent>
                    <div className="form badge-form" onSubmit={ this.saveBadge.bind(this) }>
                        <h3>Badge details</h3>
                        { this.state.image ? <img className="badge-image" src={ Cookies.host+"/images/badges/"+this.state.image } /> : '' }

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
                            <a><span className="nav-button" onClick={ this.openForm.bind(this) }>Add</span></a>
                        </div>

                        <Modal isOpen={this.state.isFormOpen}>
                            <CriteriaForm onClose={ this.closeForm.bind(this) } onSave={ this.addCriteria.bind(this) } criteria={ this.state.criteria } />
                        </Modal>

                        <CriteriaList badge_criteria={ this.state.badge_criteria } onClick={ this.editCriteria.bind(this) } />
                    </div>
                </PageContent>
            </div>
        )
    }
}
