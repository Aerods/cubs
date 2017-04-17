import React from 'react';
import { Link, browserHistory } from 'react-router';
import CheckboxInput from '../widgets/CheckboxInput';
import ValidationError from '../widgets/ValidationError';
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
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            dataType: 'application',
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
            town: '',
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
            submitted: 0
        }
    }

    validateCub(data) {
        var err = {};
        if (!data.forename) err.forename = 'This field is required';
        if (!data.surname) err.surname = 'This field is required';
        if (!data.date_of_birth) err.date_of_birth = 'This field is required';
        if (data.date_of_birth && moment(data.date_of_birth, 'DD/MM/YYYY').format() == 'Invalid date') err.date_of_birth = 'Please enter a date in DD/MM/YYYY format';
        if (data.gender != 'Male' && data.gender != 'Female') err.gender = "Please select a gender";
        if (!data.phone) err.phone = 'This field is required';
        if (!data.p1_title) err.p1_title = 'This field is required';
        if (!data.p1_forename) err.p1_forename = 'This field is required';
        if (!data.p1_surname) err.p1_surname = 'This field is required';
        if (!data.p1_relationship) err.p1_relationship = 'Please enter the relationship to the young person';
        if (!data.p1_email) err.p1_email = 'This field is required';
        if (!data.terms_1) err.terms_1 = 'Please confirm this statement';
        if (!data.terms_2) err.terms_2 = 'Please confirm this statement';
        this.setState({ validation: err });
        var PageContentDiv = document.getElementById('PageContent');
        if (Object.keys(err).length) PageContentDiv.scrollTop = 0;
        return Object.keys(err).length;
    }

    saveCub(e) {
        e.preventDefault();
        var cub = this.state;
        cub.group = 'Tedburn and Cheriton';
        cub.section = Cookies.section;
        var errors = this.validateCub(cub);
        if (!errors) {
            actions.add(cub);
            this.setState({ submitted: 1 });
        }
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
                    <Link to="/apply"><span className="nav-button">back</span></Link>
                </SubHeader>
                <PageContent apply={ apply }>
                    { !this.state.submitted ? (
                        <div className="form" onSubmit={ this.saveCub.bind(this) }>
                            <h3>{ Cookies.member } details</h3>
                            <FormGroup name="forename" label="First name:" value={ this.state.forename } onChange={ this.handleInputChange } error={ this.state.validation.forename } />
                            <FormGroup name="surname" label="Last name:" value={ this.state.surname } onChange={ this.handleInputChange } error={ this.state.validation.surname } />
                            <FormGroup name="date_of_birth" labelRight="DD/MM/YYYY" type="small" value={ this.state.date_of_birth } onChange={ this.handleInputChange } error={ this.state.validation.date_of_birth } />
                            <FormGroup name="gender" type="select" value={ this.state.gender } data={ ['Male', 'Female'] } onChange={ this.handleInputChange } error={ this.state.validation.gender } />
                            <FormGroup name="phone" label="Home phone:" value={ this.state.phone } onChange={ this.handleInputChange } error={ this.state.validation.phone } />
                            <FormGroup name="address_1" label="Address line 1:" value={ this.state.address_1 } onChange={ this.handleInputChange } />
                            <FormGroup name="address_2" label="Address line 2:" value={ this.state.address_2 } onChange={ this.handleInputChange } />
                            <FormGroup name="address_3" label="Address line 3:" value={ this.state.address_3 } onChange={ this.handleInputChange } />
                            <FormGroup name="town" value={ this.state.town } onChange={ this.handleInputChange } />
                            <FormGroup name="postcode" type="small" value={ this.state.postcode } onChange={ this.handleInputChange } />
                            <FormGroup name="medical_information" label="Medical info:" type="textarea" value={ this.state.medical_information } onChange={ this.handleInputChange } />
                            <FormGroup name="notes" label="Additional notes:" type="textarea" value={ this.state.notes } onChange={ this.handleInputChange } />
                            <div className="spacer"></div>

                            <h3>Parent / guardian 1 details</h3>
                            <FormGroup name="p1_title" label="Title:" type="select" value={ this.state.p1_title } data={ ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'] } onChange={ this.handleInputChange } error={ this.state.validation.p1_title} />
                            <FormGroup name="p1_forename" label="First name:" value={ this.state.p1_forename } onChange={ this.handleInputChange } error={ this.state.validation.p1_forename } />
                            <FormGroup name="p1_surname" label="Last name:" value={ this.state.p1_surname } onChange={ this.handleInputChange } error={ this.state.validation.p1_surname } />
                            <FormGroup name="p1_relationship" label={ "Relationship to "+Cookies.member.toLowerCase()+":" } value={ this.state.p1_relationship } onChange={ this.handleInputChange } error={ this.state.validation.p1_relationship } />
                            <div className="form-group">
                                <label className="control-label" htmlFor="lives_with_cub">{ 'Lives with ' + Cookies.member.toLowerCase() }:</label>
                                <CheckboxInput name="p1_lives_with_cub" checked={ this.state.p1_lives_with_cub } onChange={ this.handleInputChange } />
                                <ValidationError error={ this.state.validation.lives_with_cub } />
                            </div>
                            { !this.state.p1_lives_with_cub ? (<FormGroup name="p1_phone_1" type="small" label="Home phone:" value={ this.state.p1_phone_1 } onChange={ this.handleInputChange } />) : '' }
                            <FormGroup name="p1_phone_2" type="small" label="Mobile phone:" value={ this.state.p1_phone_2 } onChange={ this.handleInputChange } />
                            <FormGroup name="p1_email" label="Email address:" value={ this.state.p1_email } onChange={ this.handleInputChange } error={ this.state.validation.p1_email } />
                            { !this.state.p1_lives_with_cub ? (
                                <div>
                                    <FormGroup name="p1_address_1" label="Address line 1:" value={ this.state.p1_address_1 } onChange={ this.handleInputChange } />
                                    <FormGroup name="p1_address_2" label="Address line 2:" value={ this.state.p1_address_2 } onChange={ this.handleInputChange } />
                                    <FormGroup name="p1_address_3" label="Address line 3:" value={ this.state.p1_address_3 } onChange={ this.handleInputChange } />
                                    <FormGroup name="p1_town" label="Town:" value={ this.state.p1_town } onChange={ this.handleInputChange } />
                                    <FormGroup name="p1_postcode" label="Postcode:" type="small" value={ this.state.p1_postcode } onChange={ this.handleInputChange } />
                                </div>
                            ) : '' }
                            <FormGroup name="p1_skills" label="Any knowledge, skills or resources to share:" type="textarea" value={ this.state.p1_skills } onChange={ this.handleInputChange } />
                            <div className="spacer"></div>

                            <h3>Parent / guardian 2 details</h3>
                            <FormGroup name="p2_title" label="Title:" type="select" value={ this.state.p2_title } data={ ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'] } onChange={ this.handleInputChange } />
                            <FormGroup name="p2_forename" label="First name:" value={ this.state.p2_forename } onChange={ this.handleInputChange } />
                            <FormGroup name="p2_surname" label="Last name:" value={ this.state.p2_surname } onChange={ this.handleInputChange } />
                            <FormGroup name="p2_relationship" label={ "Relationship to "+Cookies.member.toLowerCase()+":" } value={ this.state.p2_relationship } onChange={ this.handleInputChange } />
                            <div className="form-group">
                                <label className="control-label" htmlFor="lives_with_cub">{ 'Lives with ' + Cookies.member.toLowerCase() }:</label>
                                <CheckboxInput name="p2_lives_with_cub" checked={ this.state.p2_lives_with_cub } onChange={ this.handleInputChange } />
                            </div>
                            { !this.state.p2_lives_with_cub ? (<FormGroup name="p2_phone_1" type="small" label="Home phone:" value={ this.state.p2_phone_1 } onChange={ this.handleInputChange } />) : '' }
                            <FormGroup name="p2_phone_2" type="small" label="Mobile phone:" value={ this.state.p2_phone_2 } onChange={ this.handleInputChange } />
                            <FormGroup name="p2_email" label="Email address:" value={ this.state.p2_email } onChange={ this.handleInputChange } />
                            { !this.state.p2_lives_with_cub ? (
                                <div>
                                    <FormGroup name="p2_address_1" label="Address line 1:" value={ this.state.p2_address_1 } onChange={ this.handleInputChange } />
                                    <FormGroup name="p2_address_2" label="Address line 2:" value={ this.state.p2_address_2 } onChange={ this.handleInputChange } />
                                    <FormGroup name="p2_address_3" label="Address line 3:" value={ this.state.p2_address_3 } onChange={ this.handleInputChange } />
                                    <FormGroup name="p2_town" label="Town:" value={ this.state.p2_town } onChange={ this.handleInputChange } />
                                    <FormGroup name="p2_postcode" label="Postcode:" type="small" value={ this.state.p2_postcode } onChange={ this.handleInputChange } />
                                </div>
                            ) : '' }
                            <FormGroup name="p2_skills" label="Any knowledge, skills or resources to share:" type="textarea" value={ this.state.p2_skills } onChange={ this.handleInputChange } />

                            <div className="spacer"></div>
                            <div className="form-group terms">
                                <label className="control-label" htmlFor=""></label>
                                <CheckboxInput name="terms_1" checked={ this.state.terms_1 } onChange={ this.handleInputChange } />
                                <label className="control-label-right check">I would like my child to join Tedburn and Cheriton Scout Group as soon as posible. I will pay for his/her uniform and annual subscription.</label>
                                <ValidationError error={ this.state.validation.terms_1 } />
                            </div>
                            <div className="form-group terms">
                                <label className="control-label" htmlFor=""></label>
                                <CheckboxInput name="terms_2" checked={ this.state.terms_2 } onChange={ this.handleInputChange } />
                                <label className="control-label-right check">I give explicit consent for all of the information provided on this form to be recorded by the Scout Group for Scouting purposes only.</label>
                                <ValidationError error={ this.state.validation.terms_2 } />
                            </div>
                            <div className="form-group terms">
                                <label className="control-label" htmlFor=""></label>
                                <CheckboxInput name="can_photo" checked={ this.state.can_photo } onChange={ this.handleInputChange } />
                                <label className="control-label-right check">I give content to photographic images of my child being used by the Scout Group for the express purposes of promoting the work of the Scout Association.</label>
                            </div>
                            <div className="spacer"></div>
                            <a><div className="nav-button submit" onClick={ this.saveCub.bind(this) }>Submit</div></a>
                            <div className="spacer"></div>
                            <div className="spacer"></div>
                            <div className="spacer"></div>
                        </div>
                    ) : (
                        <div className="application-submitted">
                            Thank you, your application has been submitted. Someone will be in touch soon.
                        </div>
                    )}
                </PageContent>
            </div>
        )
    }
}
