import React from 'react';
import { Link, browserHistory } from 'react-router';
import Cookies from '../cookies.js';
import * as actions from '../Actions';
import Store from '../store';
var moment = require('moment');
import SelectBadge from '../components/SelectBadge';
import Modal from '../widgets/Modal';
import CriteriaList from '../components/CriteriaList';
import DataTable from '../widgets/DataTable';
import SelectInput from '../widgets/SelectInput';
import ValidationError from '../widgets/ValidationError';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

export default class ProgrammeForm extends React.Component {
    constructor() {
        super();
        this.setMeeting = this.setMeeting.bind(this);
        this.setCubs = this.setCubs.bind(this);
        this.setBadges = this.setBadges.bind(this);
        this.setAllBadges = this.setAllBadges.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            dataType: 'programme',
            date: '',
            title: '',
            type: 'Standard',
            location: '',
            details: '',
            start_time: (Cookies.section == 'Cubs' ? '18:30' : '17:15'),
            end_time: (Cookies.section == 'Cubs' ? '20:00' : '18:15'),
            end_date: '',
            validation: {},
            isModalOpen: false,
            all_badges: [],
            badge_criteria: [],
            badges: [],
            cubs: []
        }
    }

    componentWillMount() {
        if (this.props.params.id) {
            actions.get({ dataType: 'programme', id: this.props.params.id });
            actions.get({ dataType: 'programme_cubs', programme_id: this.props.params.id });
            actions.get({ dataType: 'programme_badge', programme_id: this.props.params.id });
        }
        actions.get({ dataType: 'badgesWithCriteria' });

        Store.on('programme-get', this.setMeeting);
        Store.on('programme_cubs-get', this.setCubs);
        Store.on('programme_badge-get', this.setBadges);
        Store.on('badgesWithCriteria-get', this.setAllBadges);
        Store.on('programme-destroy', this.navBack);
        Store.on('programme-add', this.navBack);
        Store.on('programme-update', this.navBack);
    }

    componentWillUnmount() {
        Store.removeListener('programme-get', this.setMeeting);
        Store.removeListener('programme_cubs-get', this.setCubs);
        Store.removeListener('programme_badge-get', this.setBadges);
        Store.removeListener('badgesWithCriteria-get', this.setAllBadges);
    }

    handleInputChange(e) {
        var name = e.target.name;
        var state = this.state;
        state[name] = e.target.value;
        state.validation[name] = '';
        this.setState(state);
    }

    setMeeting() {
        var meeting = Store.data[0];
        this.setState({
          id: meeting.id,
          date: meeting.date,
          title: meeting.title,
          type: meeting.type,
          location: meeting.location,
          details: meeting.details,
          start_time: meeting.start_time,
          end_time: meeting.end_time,
          end_date: meeting.end_date
        });
    }

    setCubs() {
        this.setState({ cubs: Store.data });
    }

    setBadges() {
        this.setState({ badges: Store.data });
    }

    setAllBadges() {
        this.setState({ all_badges: Store.data });
    }

    validateMeeting(data) {
        var err = {};
        if (moment(data.date, 'DD/MM/YYYY').format() == 'Invalid date') err.date = 'Please enter a date in DD/MM/YYYY format';
        if (!data.title) err.title = 'Please enter a title';
        if (!data.type) err.type = 'Please select a type';
        if (!data.location && data.type != 'Standard') err.location = 'Please enter a location';
        if (moment(data.start_time, 'HH:mm').format() == 'Invalid date') err.start_time = 'Please enter a time in HH:MM format';
        if (moment(data.end_time, 'HH:mm').format() == 'Invalid date') err.end_time = 'Please enter a time in HH:MM format';
        if (data.type == 'Camp' && moment(data.end_date, 'DD/MM/YYYY').format() == 'Invalid date') err.end_date = 'Please enter a date in DD/MM/YYYY format';
        this.setState({ validation: err });
        return Object.keys(err).length;
    }

    saveMeeting(e) {
        e.preventDefault();
        var meeting = this.state;
        var errors = this.validateMeeting(meeting);
        if (!errors) {
            if (this.state.id) {
                actions.update(meeting);
            } else {
                actions.add(meeting);
            }
        }
    }

    deleteMeeting(e) {
        e.preventDefault();
        var confirmed = confirm("Delete this record?");
        if (confirmed) {
            actions.destroy({ id: this.state.id, dataType: 'programme' });
        }
    }

    navBack() {
        browserHistory.push('/programme');
    }

    addBadge(badge) {
        var badges = this.state.badges;
        badges.push(badge);
        this.setState({
            badges: badges,
            isModalOpen: false
        });
    }

    openModal() {
        this.setState({ isModalOpen: true });
    }
    closeModal() {
        this.setState({ isModalOpen: false });
    }

    selectCub(cub) {
        var cubs = this.state.cubs;
        var new_cubs = [];
        cubs.map(function(new_cub) {
            if (cub.id == new_cub.id) {
                new_cub.selected = !new_cub.selected;
            }
            new_cubs.push(new_cub);
        });
        this.setState({ cubs: new_cubs });
    }

    selectAll() {
        var new_cubs = this.state.cubs.map(function(cub) {
            cub.selected = 1;
            return cub;
        });
        this.setState({ cubs: new_cubs });
    }

    deselectAll() {
        var new_cubs = this.state.cubs.map(function(cub) {
            cub.selected = 0;
            return cub;
        });
        this.setState({ cubs: new_cubs });
    }

    render() {
        var self = this;
        var meetingEndDateTime = moment(this.state.date + ' ' + this.state.end_time, 'DD/MM/YYYY HH:mm');
        var meetingInPast = moment().isAfter(meetingEndDateTime);
        var headers = {
            forename: 'First name',
            surname: 'Last name',
            date_of_birth: 'Date of birth'
        };
        var badgeWork = this.state.badges.map(function(badge, key) {
            function clickTask(task) {
                var badge_criteria = badge.badge_criteria;
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
                badge.badge_criteria = new_badge_criteria;
                var badges = self.state.badges;
                badges[key] = badge;
                self.setState({ badges: badges });
            }

            function clickCriteria(criteria) {
                var badge_criteria = badge.badge_criteria;
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
                badge.badge_criteria = new_badge_criteria;
                var badges = self.state.badges;
                badges[key] = badge;
                self.setState({ badges: badges });
            }

            function removeBadge() {
                var badges = self.state.badges;
                badges.splice(key, 1);
                self.setState({ badges: badges });
            }

            var badgeName = badge.type == 'Staged' ? (<h4>{ badge.name + ' - stage ' + badge.stage }</h4>) : (<h4>{ badge.name }</h4>);
            var badge_criteria = badge.badge_criteria;

            return (
                <div key={ key }>
                    <div className="form-buttons">
                        <a><span className="nav-button" onClick={ removeBadge }>Remove badge</span></a>
                    </div>

                    <div className="select-activity">
                    { badgeName }
                        <CriteriaList
                            badge_criteria={ badge_criteria }
                            onClick={ function() {} }
                            clickCriteria={ clickCriteria }
                            clickTask={ clickTask } />
                    </div>
                    <div className="spacer" />
                </div>
            );
        });

        return(
            <div id="ProgrammeForm">
                <SubHeader heading={ this.state.id ? 'Edit meeting' : 'New meeting' }>
                    <Link to="/programme"><span className="nav-button">back</span></Link>
                    { this.state.id ? <a><span className="nav-button" onClick={ this.deleteMeeting.bind(this) }>Delete</span></a> : '' }
                    { this.state.id ? <Link to={"/programmePrint/"+this.state.id}><span className="nav-button">Print</span></Link> : '' }
                    <a><span className="nav-button" onClick={ this.saveMeeting.bind(this) }>Save</span></a>
                </SubHeader>

                <PageContent>
                    <div className="form">
                        <h3>Meeting details</h3>
                        <div className="form-group">
                            <label className="control-label" htmlFor="date">Date:</label>
                            <input type="text" className="form-control small" name="date" value={ this.state.date } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.date } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="title">Title:</label>
                            <input type="text" className="form-control" name="title" value={ this.state.title } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.title } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="forename">Type:</label>
                            <SelectInput
                                data={ ['Standard', 'Off site', 'Camp'] }
                                selected={ this.state.type }
                                name="type"
                                onChange={ this.handleInputChange } />
                        </div>
                        { this.state.type != 'Standard' ? <div className="form-group">
                            <label className="control-label" htmlFor="location">Location:</label>
                            <input type="text" className="form-control" name="location" value={ this.state.location } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.location } />
                        </div> : '' }
                        <div className="form-group">
                            <label className="control-label" htmlFor="details">Details:</label>
                            <textarea type="text" className="form-control" name="details" value={ this.state.details } onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="start_time">Start time:</label>
                            <input type="text" className="form-control small" name="start_time" value={ this.state.start_time } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.start_time } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="end_time">End time:</label>
                            <input type="text" className="form-control small" name="end_time" value={ this.state.end_time } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.end_time } />
                        </div>
                        { this.state.type == 'Camp' ? <div className="form-group">
                            <label className="control-label" htmlFor="end_date">End date:</label>
                            <input type="text" className="form-control small" name="end_date" value={ this.state.end_date } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.end_date } />
                        </div> : '' }

                        <h3>Badge work</h3>
                        <div className="spacer" />

                        <Modal isOpen={ this.state.isModalOpen }>
                            <SelectBadge badges={ this.state.all_badges } addBadge={ this.addBadge.bind(this) } closeModal={ this.closeModal.bind(this) } />
                        </Modal>

                        { badgeWork }
                        <div className="form-buttons">
                            <a><span className="nav-button" onClick={ self.openModal.bind(this) }>Add badge</span></a>
                        </div>

                        { meetingInPast ? <div>
                            <div className="spacer" />
                            <h3>Cubs</h3>
                            <a><span className="nav-button" onClick={ this.selectAll.bind(this) }>select all</span></a>
                            <a><span className="nav-button" onClick={ this.deselectAll.bind(this) }>deselect all</span></a>
                            <DataTable headers={ headers } data={ this.state.cubs } onClick={ this.selectCub.bind(this) } height="short" />
                            <div className="spacer" />
                        </div> : '' }
                    </div>
                </PageContent>
            </div>
        )
    }
}
