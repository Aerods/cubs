import React from 'react';
import { Link, browserHistory } from 'react-router';
var actions = require('../Actions');
var store = require('../store');
var moment = require('moment');
import DataTable from '../widgets/DataTable';
import CubBadgeList from '../components/CubBadgeList';
import Modal from '../widgets/Modal';
import AddCubParent from '../components/AddCubParent';
import SelectBadge from '../components/SelectBadge';
import ParentForm from './ParentForm';
import SelectInput from '../widgets/SelectInput';
import ValidationError from '../widgets/ValidationError';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

var CubForm = React.createClass({
    getDefaultProps: function() {
      return {
          id: null,
          params: { id: null }
      }
    },
    getInitialState: function() {
      return {
          dataType: 'cub',
          id: this.props.params.id,
          forename: '',
          surname: '',
          date_of_birth: '',
          gender: '',
          rank: '',
          six: '',
          phone: '',
          address_1: '',
          address_2: '',
          address_3: '',
          town: 'Exeter',
          postcode: '',
          start_date: '',
          from_beavers: '',
          invested: '',
          previous_group: '',
          medical_information: '',
          notes: '',
          to_scouts: '',
          parents: [],
          cub_parents: [],
          badges: [],
          cub_badges: [],
          parent: {},
          validation: {},
          isParentModalOpen: false,
          isBadgeModalOpen: false,
          isFormOpen: false
      }
    },

    componentDidMount: function() {
        var self = this;
        if (this.props.params.id) {
            store.onChange({ dataType: 'cub', id: this.props.params.id }, function(cubs) {
                var cub = cubs[0];
                self.setState({
                    forename: cub.forename,
                    surname: cub.surname,
                    date_of_birth: cub.date_of_birth,
                    gender: cub.gender,
                    rank: cub.rank,
                    six: cub.six,
                    phone: cub.phone,
                    address_1: cub.address_1,
                    address_2: cub.address_2,
                    address_3: cub.address_3,
                    town: cub.town,
                    postcode: cub.postcode,
                    start_date: cub.start_date,
                    from_beavers: cub.from_beavers,
                    invested: cub.invested,
                    previous_group: cub.previous_group,
                    medical_information: cub.medical_information,
                    notes: cub.notes,
                    to_scouts: cub.to_scouts
                });
            });
            store.onChange({ dataType: 'parent', cub_id: this.props.params.id }, function(parents) {
                var cub_parents = parents.map(function(parent, key) {
                    parent.uuid = key + 1;
                    parent.cub_id = self.state.id;
                    return parent;
                });
                self.setState({ cub_parents: cub_parents });
            });
            store.onChange({ dataType: 'cubBadge', cub_id: this.props.params.id }, function(cub_badges) {
                self.setState({ cub_badges: cub_badges });
            });
        };
        store.onChange({ dataType: 'parent' }, function(parents) {
            self.setState({ parents: parents });
        });
        store.onChange({ dataType: 'badge' }, function(badges) {
            self.setState({ badges: badges });
        });
    },

    validateCub: function(data) {
        var err = {};
        if (!data.forename) err.forename = 'Please enter a first name';
        if (!data.surname) err.surname = 'Please enter a last name';
        if (data.date_of_birth && moment(data.date_of_birth, 'DD/MM/YYYY').format() == 'Invalid date') err.date_of_birth = 'Please enter a date in DD/MM/YYYY format';
        if (data.gender != 'Male' && data.gender != 'Female') err.gender = "Please select a gender";
        if (data.start_date && moment(data.start_date, 'DD/MM/YYYY').format() == 'Invalid date') err.start_date = 'Please enter a date in DD/MM/YYYY format';
        if (data.from_beavers && moment(data.from_beavers, 'DD/MM/YYYY').format() == 'Invalid date') err.from_beavers = 'Please enter a date in DD/MM/YYYY format';
        if (data.invested && moment(data.invested, 'DD/MM/YYYY').format() == 'Invalid date') err.invested = 'Please enter a date in DD/MM/YYYY format';
        if (data.to_scouts && moment(data.to_scouts, 'DD/MM/YYYY').format() == 'Invalid date') err.to_scouts = 'Please enter a date in DD/MM/YYYY format';
        this.setState({ validation: err });
        return Object.keys(err).length;
    },

    saveCub: function(e) {
        e.preventDefault();
        var cub = this.state;
        cub.parents = cub.cub_parents;
        cub.badges = cub.cub_badges;
        var errors = this.validateCub(cub);
        if (!errors) {
            if (this.props.params.id) {
                actions.update(cub, function(data) {
                    browserHistory.push('/cubs/'+data.id);
                });
            } else {
                actions.add(cub, function(data) {
                    browserHistory.push('/cubs/'+data.id);
                });
            }
        }
    },

    handleInputChange: function(e) {
      var name = e.target.name;
      var state = this.state;
      state[name] = e.target.value;
      state.validation[name] = '';
      this.setState(state);
    },

    closeForm: function() {
        this.setState({ isFormOpen: false });
    },

    render: function() {
        return(
            <div id="CubForm">
                <SubHeader heading={ this.props.params.id ? 'Edit cub' : 'New cub' }>
                    <Link to={ this.props.params.id ? "/cubs/"+this.props.params.id : "/cubs" }><span className="nav-button">back</span></Link>
                    <a><span className="nav-button" onClick={ this.saveCub }>Save</span></a>
                </SubHeader>
                <PageContent>
                    <div className="form" onSubmit={ this.saveCub }>

                        <h3>Cub details</h3>
                        <div className="form-group">
                            <label className="control-label" htmlFor="forename">First name:</label>
                            <input type="text" className="form-control" id="forename" name="forename" value={ this.state.forename } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.forename } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="surname">Last name:</label>
                            <input type="text" className="form-control" id="surname" name="surname" value={ this.state.surname } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.surname } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="date_of_birth">Date of birth:</label>
                            <input type="text" className="form-control small" id="date_of_birth" name="date_of_birth" value={ this.state.date_of_birth } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.date_of_birth } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="gender">Gender:</label>
                            <SelectInput
                                data={ ['Male', 'Female'] }
                                selected={ this.state.gender }
                                name="gender"
                                onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.gender } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="rank">Rank:</label>
                            <SelectInput
                                data={ ['None', 'Sixer', 'Seconder'] }
                                selected={ this.state.rank }
                                name="rank"
                                onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="six">Six:</label>
                            <SelectInput
                                data={ ['Red', 'Blue', 'Green', 'Yellow'] }
                                selected={ this.state.six }
                                name="six"
                                onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="phone">Home phone:</label>
                            <input type="text" className="form-control" id="phone" name="phone" value={ this.state.phone } onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="address_1">Address line 1:</label>
                            <input type="text" className="form-control" id="address_1" name="address_1" value={ this.state.address_1 } onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="address_2">Address line 2:</label>
                            <input type="text" className="form-control" id="address_2" name="address_2" value={ this.state.address_2 } onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="address_3">Address line 3:</label>
                            <input type="text" className="form-control" id="address_3" name="address_3" value={ this.state.address_3 } onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="town">Town:</label>
                            <input type="text" className="form-control" id="town" name="town" value={ this.state.town } onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="postcode">Postcode:</label>
                            <input type="text" className="form-control small" id="postcode" name="postcode" value={ this.state.postcode } onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="start_date">Start date:</label>
                            <input type="text" className="form-control small" id="start_date" name="start_date" value={ this.state.start_date } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.start_date } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="start_date">From Beavers:</label>
                            <input type="text" className="form-control small" id="from_beavers" name="from_beavers" value={ this.state.from_beavers } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.from_beavers } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="invested">Invested:</label>
                            <input type="text" className="form-control small" id="invested" name="invested" value={ this.state.invested } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.invested } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="previous_group">Previous group:</label>
                            <input type="text" className="form-control" id="previous_group" name="previous_group" value={ this.state.previous_group } onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="medical_information">Medical info:</label>
                            <textarea type="text" className="form-control" id="medical_information" name="medical_information" value={ this.state.medical_information } onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="notes">Notes:</label>
                            <textarea type="text" className="form-control" id="notes" name="notes" value={ this.state.notes } onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="to_scouts">To Scouts:</label>
                            <input type="text" className="form-control small" id="to_scouts" name="to_scouts" value={ this.state.to_scouts } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.to_scouts } />
                        </div>

                    </div>
                </PageContent>
            </div>
        )
    }
})

export default CubForm;
