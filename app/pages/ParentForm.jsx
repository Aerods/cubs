import React from 'react';
import { Link, browserHistory } from 'react-router';
import CheckboxInput from '../widgets/CheckboxInput';
import SelectInput from '../widgets/SelectInput';
import ValidationError from '../widgets/ValidationError';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';
import * as actions from '../Actions';
import Store from '../store';
import FormGroup from '../widgets/FormGroup';

export default class ParentForm extends React.Component {
    constructor() {
        super();
        this.setParent = this.setParent.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = {
            dataType: 'parent',
            title: '',
            forename: '',
            surname: '',
            relationship: '',
            lives_with_cub: false,
            phone_1: '',
            phone_2: '',
            email: '',
            address_1: '',
            address_2: '',
            address_3: '',
            town: '',
            postcode: '',
            cub_id: null,
            uuid: null,
            validation: {},
            hasCubData: 0
        }
    }

    componentWillMount() {
        if (this.props.cub) {
            this.setState({
                hasCubData: 1,
                surname: this.props.cub.surname,
                lives_with_cub: (Object.keys(this.props.cub).length ? true : false),
                phone_1: this.props.cub.phone,
                address_1: this.props.cub.address_1,
                address_2: this.props.cub.address_2,
                address_3: this.props.cub.address_3,
                town: this.props.cub.town,
                postcode: this.props.cub.postcode,
            });
        }

        if (this.props.params.id) {
            actions.get({ dataType: 'parent', id: this.props.params.id });
        } else if (this.props.parent) {
            var parent = this.props.parent;
            this.setParent(parent);
        }
        Store.on('parent-get', this.setParent);
        Store.on('parent-add', this.navBack);
        Store.on('parent-update', this.navBack);
    }

    componentWillUnmount() {
        Store.removeListener('parent-get', this.setParent);
        Store.on('parent-destroy', this.navBack);
    }

    setParent(parent) {
        if (!parent) parent = Store.data[0];
        this.setState({
            id: parent.id,
            title: parent.title,
            forename: parent.forename,
            surname: parent.surname,
            relationship: parent.relationship,
            lives_with_cub: parent.lives_with_cub,
            phone_1: parent.phone_1,
            phone_2: parent.phone_2,
            email: parent.email,
            address_1: parent.address_1,
            address_2: parent.address_2,
            address_3: parent.address_3,
            town: parent.town,
            postcode: parent.postcode,
            cub_id: parent.cub_id,
            uuid: parent.uuid
        });
    }

    handleInputChange(e) {
        var name = e.target.name;
        var state = this.state;
        state[name] = e.target.value;
        state.validation[name] = '';

        if (name == 'lives_with_cub' && e.target.checked) {
            var cub = this.props.cub;
            state.phone_1 = (cub.phone || '');
            state.address_1 = (cub.address_1 || '');
            state.address_2 = (cub.address_2 || '');
            state.address_3 = (cub.address_3 || '');
            state.town = (cub.town || '');
            state.postcode = (cub.postcode || '');
        } else if (name == 'lives_with_cub') {
            state.phone_1 = '';
            state.address_1 = '';
            state.address_2 = '';
            state.address_3 = '';
            state.town = '';
            state.postcode = '';
        }
        this.setState(state);
    }

    validateParent(data) {
        var err = {};
        if (!data.title) err.title = 'Please select a title';
        if (!data.forename) err.forename = 'Please enter a first name';
        if (!data.surname) err.surname = 'Please enter a last name';
        if (!data.relationship) err.relationship = 'Please select a relationship';
        this.setState({ validation: err });
        return Object.keys(err).length;
    }

    saveParent(e) {
        e.preventDefault();
        var parent = this.state;
        var errors = this.validateParent(parent);
        if (!errors) {
            if (this.props.onSave) {
                this.props.onSave(parent);
            } else {
                parent.dataType = 'parent';
                if (this.props.params.id) {
                    parent.id = this.props.params.id;
                    actions.update(parent);
                } else {
                    actions.add(parent);
                }
            }
        }
    }

    deleteParent() {
        var confirmed = confirm("Delete this record?");
        if (confirmed) {
            actions.destroy({ id: this.props.params.id, dataType: 'parent' });
        }
    }

    navBack() {
        browserHistory.push('/parents');
    }

    render() {
        return(
            <div id="ParentForm">
                <SubHeader heading={ this.props.params.id ? 'Edit' : 'New parent' }>
                    { this.props.onClose ? <span className="grow"></span> : '' }
                    { this.props.onClose ?
                        <a><span className="nav-button" onClick={ this.props.onClose }>Cancel</span></a>
                    :
                        <Link to="/parents"><span className="nav-button">back</span></Link>
                    }
                    { this.props.params.id && !this.props.onClose ? <a><span className="nav-button" onClick={ this.deleteParent.bind(this) }>Delete</span></a> : '' }
                    <a><span className="nav-button" onClick={ this.saveParent.bind(this) }>Save</span></a>
                </SubHeader>

                <PageContent isModal={ this.props.onClose }>

                    <div className="form" onSubmit={ this.saveParent.bind(this) }>
                        <h3>Parent details</h3>
                        <FormGroup name="title" type="select" value={ this.state.title } data={ ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'] } onChange={ this.handleInputChange } error={ this.state.validation.title} />
                        <FormGroup name="forename" label="First name:" value={ this.state.forename } onChange={ this.handleInputChange } error={ this.state.validation.forename } />
                        <FormGroup name="surname" label="Last name:" value={ this.state.surname } onChange={ this.handleInputChange } error={ this.state.validation.surname } />
                        <FormGroup name="relationship" label="Relationship:" value={ this.state.relationship } onChange={ this.handleInputChange } error={ this.state.validation.relationship } />
                        { this.state.hasCubData ? <div className="form-group">
                            <label className="control-label" htmlFor="lives_with_cub">Lives with cub:</label>
                            <CheckboxInput name="lives_with_cub" checked={ this.state.lives_with_cub } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.lives_with_cub } />
                        </div> : '' }
                        <FormGroup name="phone_1" type="small" label="Home phone:" value={ this.state.phone_1 } onChange={ this.handleInputChange } />
                        <FormGroup name="phone_2" type="small" label="Mobile phone:" value={ this.state.phone_2 } onChange={ this.handleInputChange } />
                        <FormGroup name="email" label="Email address:" value={ this.state.email } onChange={ this.handleInputChange } />
                        <FormGroup name="address_1" label="Address line 1:" value={ this.state.address_1 } onChange={ this.handleInputChange } />
                        <FormGroup name="address_2" label="Address line 2:" value={ this.state.address_2 } onChange={ this.handleInputChange } />
                        <FormGroup name="address_3" label="Address line 3:" value={ this.state.address_3 } onChange={ this.handleInputChange } />
                        <FormGroup name="town" value={ this.state.town } onChange={ this.handleInputChange } />
                        <FormGroup name="postcode" type="small" value={ this.state.postcode } onChange={ this.handleInputChange } />
                    </div>
                </PageContent>
            </div>
        )
    }
}
