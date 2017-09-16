import React from 'react';
import { Link, browserHistory } from 'react-router';
import CheckboxInput from '../widgets/CheckboxInput';
import Cookies from '../cookies.js';
import * as actions from '../Actions';
import Store from '../store';
import moment from 'moment';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';
import FormGroup from '../widgets/FormGroup';

export default class CubForm extends React.Component {
    constructor() {
        super();
        this.setCub = this.setCub.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            dataType: 'cub',
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
            can_photo: false,
            waiting: false,
            to_scouts: '',
            parents: [],
            cub_parents: [],
            badges: [],
            cub_badges: [],
            parent: {},
            validation: {}
        }
    }

    componentWillMount() {
        if (this.props.params.id) {
            actions.get({ dataType: 'cub', id: this.props.params.id });
            Store.on('cub-get', this.setCub);
        };
    }

    componentWillUnmount() {
        Store.removeListener('cub-get', this.setCub);
    }

    setCub() {
        var cub = Store.data[0];
        this.setState({
            forename:               (cub.forename || ''),
            surname:                (cub.surname || ''),
            date_of_birth:          (cub.date_of_birth || ''),
            gender:                 (cub.gender || ''),
            rank:                   (cub.rank || ''),
            six:                    (cub.six || ''),
            phone:                  (cub.phone || ''),
            address_1:              (cub.address_1 || ''),
            address_2:              (cub.address_2 || ''),
            address_3:              (cub.address_3 || ''),
            town:                   (cub.town || ''),
            postcode:               (cub.postcode || ''),
            start_date:             (cub.start_date || ''),
            from_beavers:           (cub.from_beavers || ''),
            invested:               (cub.invested || ''),
            previous_group:         (cub.previous_group || ''),
            medical_information:    (cub.medical_information || ''),
            notes:                  (cub.notes || ''),
            can_photo:              (cub.can_photo || 0),
            waiting:                (cub.waiting || 0),
            to_scouts:              (cub.to_scouts || '')
        });
    }

    validateCub(data) {
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
    }

    saveCub(e) {
        e.preventDefault();
        var cub = this.state;
        var errors = this.validateCub(cub);
        if (!errors) {
            if (this.props.params.id) {
                cub.id = this.props.params.id;
                actions.update(cub);
                Store.on('cub-update', this.navToCub);
            } else {
                actions.add(cub);
                Store.on('cub-add', this.navToCub);
            }
        }
    }

    navToCub() {
        browserHistory.push('/cubs/'+Store.data.id);
    }

    handleInputChange(e) {
      var name = e.target.name;
      var state = this.state;
      state[name] = e.target.value;
      state.validation[name] = '';
      this.setState(state);
    }

    render() {
        var apply = this.props.params.apply;
        return(
            <div id="CubForm" className={ apply ? 'apply '+apply : '' }>
                <SubHeader heading={ this.props.params.id ? 'Edit '+Cookies.member : 'New '+Cookies.member }>
                    <Link to={ this.props.params.id ? "/cubs/"+this.props.params.id : "/cubs" }><span className="nav-button">back</span></Link>
                    <a><span className="nav-button" onClick={ this.saveCub.bind(this) }>Save</span></a>
                </SubHeader>
                <PageContent apply={ apply }>
                    <div className="form" onSubmit={ this.saveCub.bind(this) }>
                        <h3>{ Cookies.member } details</h3>
                        <FormGroup name="forename" label="First name:" value={ this.state.forename } onChange={ this.handleInputChange } error={ this.state.validation.forename } />
                        <FormGroup name="surname" label="Last name:" value={ this.state.surname } onChange={ this.handleInputChange } error={ this.state.validation.surname } />
                        <FormGroup name="date_of_birth" type="small" labelRight="DD/MM/YYYY" value={ this.state.date_of_birth } onChange={ this.handleInputChange } error={ this.state.validation.date_of_birth } />
                        <FormGroup name="gender" type="select" value={ this.state.gender } data={ ['Male', 'Female'] } onChange={ this.handleInputChange } error={ this.state.validation.gender } />
                        { Cookies.section == 'Cubs' ? <FormGroup name="rank" type="select" value={ this.state.rank } data={ ['None', 'Senior sixer', 'Sixer', 'Seconder'] } onChange={ this.handleInputChange } /> : '' }
                        { Cookies.section == 'Cubs' && this.state.rank != 'Senior sixer' ? (
                            <FormGroup name="six" type="select" value={ this.state.six } data={ ['Red', 'Blue', 'Green', 'Yellow'] } onChange={ this.handleInputChange } />
                        ) : '' }
                        { Cookies.section == 'Beavers' ? (
                            <FormGroup name="six" label="Lodge" type="select" value={ this.state.six } data={ ['Ducks', 'Otters', 'Turtles', 'Hares'] } onChange={ this.handleInputChange } />
                        ) : '' }
                        <FormGroup name="phone" label="Home phone:" value={ this.state.phone } onChange={ this.handleInputChange } />
                        <FormGroup name="address_1" label="Address line 1:" value={ this.state.address_1 } onChange={ this.handleInputChange } />
                        <FormGroup name="address_2" label="Address line 2:" value={ this.state.address_2 } onChange={ this.handleInputChange } />
                        <FormGroup name="address_3" label="Address line 3:" value={ this.state.address_3 } onChange={ this.handleInputChange } />
                        <FormGroup name="town" value={ this.state.town } onChange={ this.handleInputChange } />
                        <FormGroup name="postcode" type="small" value={ this.state.postcode } onChange={ this.handleInputChange } />
                        <FormGroup name="start_date" type="small" value={ this.state.start_date } onChange={ this.handleInputChange } error={ this.state.validation.start_date } />
                        { Cookies.section == 'Cubs' ? <FormGroup name="from_beavers" type="small" value={ this.state.from_beavers } onChange={ this.handleInputChange } error={ this.state.validation.from_beavers } /> : '' }
                        <FormGroup name="invested" type="small" value={ this.state.invested } onChange={ this.handleInputChange } error={ this.state.validation.invested } />
                        <FormGroup name="previous_group" value={ this.state.previous_group } onChange={ this.handleInputChange } />
                        <FormGroup name="medical_information" label="Medical info:" type="textarea" value={ this.state.medical_information } onChange={ this.handleInputChange } />
                        <FormGroup name="notes" type="textarea" value={ this.state.notes } onChange={ this.handleInputChange } />
                        <div className="form-group">
                            <label className="control-label" htmlFor="can_photo">Can photograph:</label>
                            <CheckboxInput name="can_photo" checked={ this.state.can_photo } onChange={ this.handleInputChange } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="waiting">Waiting list:</label>
                            <CheckboxInput name="waiting" checked={ this.state.waiting } onChange={ this.handleInputChange } />
                        </div>
                        <FormGroup name="to_scouts" label="Move up date:" type="small" value={ this.state.to_scouts } onChange={ this.handleInputChange } error={ this.state.validation.to_scouts } />
                    </div>
                </PageContent>
            </div>
        )
    }
}
