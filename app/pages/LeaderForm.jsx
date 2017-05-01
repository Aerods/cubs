import React from 'react';
import { Link, browserHistory } from 'react-router';
import Cookies from '../cookies.js';
import CheckboxInput from '../widgets/CheckboxInput';
import SelectInput from '../widgets/SelectInput';
import ValidationError from '../widgets/ValidationError';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';
import * as actions from '../Actions';
import Store from '../store';
import FormGroup from '../widgets/FormGroup';

export default class LeaderForm extends React.Component {
    constructor() {
        super();
        this.setLeader = this.setLeader.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            dataType: 'leader',
            title: '',
            forename: '',
            surname: '',
            position: '',
            admin: '',
            cub_name: '',
            username: '',
            password: '',
            password_2: '',
            phone_1: '',
            phone_2: '',
            email: '',
            address_1: '',
            address_2: '',
            address_3: '',
            town: 'Exeter',
            postcode: '',
            validation: {}
        }
    }

    componentWillMount() {
        if (this.props.params.id) {
            actions.get({ dataType: 'leader', id: this.props.params.id });
        }
        Store.on('leader-get', this.setLeader);
    }

    componentWillUnmount() {
        Store.removeListener('leader-get', this.setLeader);
    }

    handleInputChange(e) {
        var name = e.target.name;
        var state = this.state;
        state[name] = e.target.value;
        state.validation[name] = '';
        this.setState(state);
    }

    setLeader() {
        var leader = Store.data[0];
        this.setState({
            id: leader.id,
            title: leader.title,
            forename: leader.forename,
            surname: leader.surname,
            position: leader.position,
            admin: leader.admin,
            cub_name: leader.cub_name,
            username: leader.username,
            phone_1: leader.phone_1,
            phone_2: leader.phone_2,
            email: leader.email,
            address_1: leader.address_1,
            address_2: leader.address_2,
            address_3: leader.address_3,
            town: leader.town,
            postcode: leader.postcode
        });
    }

    validateLeader(data) {
        var err = {};
        if (!data.title) err.title = 'Please select a title';
        if (!data.forename) err.forename = 'Please enter a first name';
        if (!data.surname) err.surname = 'Please enter a last name';
        if (!data.position) err.position = 'Please select a position';
        if (data.password && !data.username) err.username = 'Please enter a username';
        if (data.password && data.password.length<8) err.password = 'Passwords must be at least 8 characters long';
        if (data.password != data.password_2) err.password_2 = 'Passwords do not match';
        this.setState({ validation: err });
        return Object.keys(err).length;
    }

    saveLeader() {
        var leader = this.state;
        var errors = this.validateLeader(leader);
        if (!errors) {
            if (this.props.params.id) {
                leader.id = this.props.params.id;
                actions.update(leader);
                Store.on('leader-update', this.navToLeader);
            } else {
                actions.add(leader);
                Store.on('leader-add', this.navToLeader);
            }
        }
    }

    navToLeader() {
        browserHistory.push('/leaders/'+Store.data.id);
    }

    render() {
        return(
            <div id="LeaderForm">
                <SubHeader heading={ this.props.params.id ? 'Edit' : 'New leader' }>
                    { this.props.onClose ?
                        <a><span className="nav-button" onClick={ this.props.onClose }>Cancel</span></a>
                    :
                        <Link to={ this.props.params.id ? "/leaders/"+this.props.params.id : "/leaders" }><span className="nav-button">back</span></Link>
                    }
                    <a><span className="nav-button" onClick={ this.saveLeader.bind(this) }>Save</span></a>
                </SubHeader>

                <PageContent>
                    <div className="form">
                        <h3>Leader details</h3>
                        <div className="form-group">
                            <label className="control-label" htmlFor="title">Title:</label>
                            <SelectInput
                                data={ ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'] }
                                selected={ this.state.title }
                                name="title"
                                onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.title } />
                        </div>
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

                        <FormGroup
                            name="position"
                            readonly={ !Cookies.admin }
                            type="select"
                            value={ this.state.position }
                            data={ Cookies.section == 'Cubs' ? ['CSL', 'ACSL', 'SA', 'OH', 'YL'] : ['BSL', 'ABSL', 'SA', 'OH', 'YL'] }
                            onChange={ this.handleInputChange }
                            error={ this.state.validation.position } />
                        { Cookies.admin ? (
                            <div className="form-group">
                                <label className="control-label" htmlFor="admin">Admin:</label>
                                <CheckboxInput name="admin" checked={ this.state.admin } onChange={ this.handleInputChange } />
                            </div>
                        ) : '' }
                        { Cookies.section == 'Cubs' ? <div className="form-group">
                            <label className="control-label" htmlFor="cub_name">Cub name:</label>
                            <input type="text" className="form-control" id="cub_name" name="cub_name" value={ this.state.cub_name } onChange={ this.handleInputChange } />
                        </div> : '' }
                        { Cookies.leader_id == this.props.params.id ? <div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="username">Username:</label>
                                <input type="text" className="form-control" id="username" name="username" value={ this.state.username } onChange={ this.handleInputChange } />
                                <ValidationError error={ this.state.validation.username } />
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="password">Password:</label>
                                <input type="password" className="form-control" id="password" name="password" value={ this.state.password } onChange={ this.handleInputChange } />
                                <ValidationError error={ this.state.validation.password } />
                            </div>
                            <div className="form-group">
                                <label className="control-label" htmlFor="password_2">Confirm password:</label>
                                <input type="password" className="form-control" id="password_2" name="password_2" value={ this.state.password_2 } onChange={ this.handleInputChange } />
                                <ValidationError error={ this.state.validation.password_2 } />
                            </div>
                        </div> : '' }
                        <div className="form-group">
                            <label className="control-label" htmlFor="phone_1">Home phone:</label>
                            <input type="text" className="form-control small" id="phone_1" name="phone_1" value={ this.state.phone_1 } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.phone_1 } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="phone_2">Mobile phone:</label>
                            <input type="text" className="form-control small" id="phone_2" name="phone_2" value={ this.state.phone_2 } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.phone_2 } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="email">Email address:</label>
                            <input type="text" className="form-control" id="email" name="email" value={ this.state.email } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.email } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="address_1">Address line 1:</label>
                            <input type="text" className="form-control" id="address_1" name="address_1" value={ this.state.address_1 } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.address_1 } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="address_2">Address line 2:</label>
                            <input type="text" className="form-control" id="address_2" name="address_2" value={ this.state.address_2 } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.address_2 } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="address_3">Address line 3:</label>
                            <input type="text" className="form-control" id="address_3" name="address_3" value={ this.state.address_3 } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.address_3 } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="town">Town:</label>
                            <input type="text" className="form-control" id="town" name="town" value={ this.state.town } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.town } />
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="post">Postcode:</label>
                            <input type="text" className="form-control small" id="postcode" name="postcode" value={ this.state.postcode } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.postcode } />
                        </div>
                    </div>
                </PageContent>
            </div>
        )
    }
}
