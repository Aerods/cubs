import React from 'react';
import { Link, browserHistory } from 'react-router';
var actions = require('../Actions');
var store = require('../store');
var moment = require('moment');
import DataTable from '../widgets/DataTable';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';
import FormGroup from '../widgets/FormGroup';

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
            validation: {}
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
        };
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
                        <FormGroup name="forename" label="First name:" value={ this.state.forename } onChange={ this.handleInputChange } error={ this.state.validation.forename } />
                        <FormGroup name="surname" label="Last name:" value={ this.state.surname } onChange={ this.handleInputChange } error={ this.state.validation.surname } />
                        <FormGroup name="date_of_birth" type="small" value={ this.state.date_of_birth } onChange={ this.handleInputChange } error={ this.state.validation.date_of_birth } />
                        <FormGroup name="gender" type="select" value={ this.state.gender } data={ ['Male', 'Female'] } onChange={ this.handleInputChange } error={ this.state.validation.gender } />
                        <FormGroup name="rank" type="select" value={ this.state.rank } data={ ['None', 'Sixer', 'Seconder'] } onChange={ this.handleInputChange } />
                        <FormGroup name="six" type="select" value={ this.state.six } data={ ['Red', 'Blue', 'Green', 'Yellow'] } onChange={ this.handleInputChange } />
                        <FormGroup name="phone" label="Home phone:" value={ this.state.phone } onChange={ this.handleInputChange } />
                        <FormGroup name="address_1" label="Address line 1:" value={ this.state.address_1 } onChange={ this.handleInputChange } />
                        <FormGroup name="address_2" label="Address line 2:" value={ this.state.address_2 } onChange={ this.handleInputChange } />
                        <FormGroup name="address_3" label="Address line 3:" value={ this.state.address_3 } onChange={ this.handleInputChange } />
                        <FormGroup name="town" value={ this.state.town } onChange={ this.handleInputChange } />
                        <FormGroup name="postcode" type="small" value={ this.state.postcode } onChange={ this.handleInputChange } />
                        <FormGroup name="start_date" type="small" value={ this.state.start_date } onChange={ this.handleInputChange } error={ this.state.validation.start_date } />
                        <FormGroup name="from_beavers" type="small" value={ this.state.from_beavers } onChange={ this.handleInputChange } error={ this.state.validation.from_beavers } />
                        <FormGroup name="invested" type="small" value={ this.state.invested } onChange={ this.handleInputChange } error={ this.state.validation.invested } />
                        <FormGroup name="previous_group" value={ this.state.previous_group } onChange={ this.handleInputChange } />
                        <FormGroup name="medical_information" label="Medical info:" type="textarea" value={ this.state.medical_information } onChange={ this.handleInputChange } />
                        <FormGroup name="notes" type="textarea" value={ this.state.notes } onChange={ this.handleInputChange } />
                        <FormGroup name="to_scouts" type="small" value={ this.state.to_scouts } onChange={ this.handleInputChange } error={ this.state.validation.to_scouts } />
                    </div>
                </PageContent>
            </div>
        )
    }
})

export default CubForm;
