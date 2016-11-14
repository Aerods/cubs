import React from 'react';
import { Link, browserHistory } from 'react-router';
import CheckboxInput from '../widgets/CheckboxInput';
import SelectInput from '../widgets/SelectInput';
import ValidationError from '../widgets/ValidationError';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';
var actions = require('../Actions');
var store = require('../store');

var ParentForm = React.createClass({
    getDefaultProps: function() {
      return {
          params: { id: null },
          parent: null,
          cub: {},
          onClose: null
      }
    },
    getInitialState: function() {
      return {
          dataType: 'parent',
          id: this.props.params.id,
          title: '',
          forename: '',
          surname: (this.props.cub.surname || ''),
          relationship: '',
          lives_with_cub: (Object.keys(this.props.cub).length ? true : false),
          phone_1: (this.props.cub.phone || ''),
          phone_2: '',
          email: '',
          address_1: (this.props.cub.address_1 || ''),
          address_2: (this.props.cub.address_2 || ''),
          address_3: (this.props.cub.address_3 || ''),
          town: (this.props.cub.town || ''),
          postcode: (this.props.cub.postcode || ''),
          cub_id: null,
          uuid: null,
          validation: {}
      }
    },

    handleInputChange: function(e) {
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
    },

    setParent: function(parent) {
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
    },

    componentDidMount: function() {
        var self = this;
        if (this.props.params.id) {
            store.onChange({ dataType: 'parent', id: this.props.params.id }, function(parents) {
                var parent = parents[0];
                self.setParent(parent);
            });
        } else if (this.props.parent) {
            var parent = this.props.parent;
            self.setParent(parent);
        }
    },

    validateParent: function(data) {
        var err = {};
        if (!data.title) err.title = 'Please select a title';
        if (!data.forename) err.forename = 'Please enter a first name';
        if (!data.surname) err.surname = 'Please enter a last name';
        if (!data.relationship) err.relationship = 'Please select a relationship';
        this.setState({ validation: err });
        return Object.keys(err).length;
    },

    saveParent: function(e) {
        e.preventDefault();
        var parent = this.state;
        var errors = this.validateParent(parent);
        if (!errors) {
            if (this.props.onSave) {
                this.props.onSave(parent);
            } else {
                parent.dataType = 'parent';
                this.props.params.id ? actions.update(parent) : actions.add(parent);
                browserHistory.push('/parents');
            }
        }
    },

    deleteParent: function(e) {
        e.preventDefault();
        actions.destroy({ id: this.props.params.id, dataType: 'parent' });
        browserHistory.push('/parents');
    },

    render: function() {
        return(
            <div id="ParentForm">
                <SubHeader heading={ this.props.params.id ? 'Edit' : 'New parent' }>
                    <span className="grow"></span>
                    { this.props.onClose ?
                        <a><span className="nav-button" onClick={ this.props.onClose }>Cancel</span></a>
                    :
                        <Link to="/parents"><span className="nav-button">back</span></Link>
                    }
                    { this.props.params.id && !this.props.onClose ? <a><span className="nav-button" onClick={ this.deleteParent }>Delete</span></a> : '' }
                    <a><span className="nav-button" onClick={ this.saveParent }>Save</span></a>
                </SubHeader>

                <PageContent isModal={ this.props.onClose }>

                    <div className="form" onSubmit={ this.saveParent }>
                        <h3>Parent details</h3>
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
                        <div className="form-group">
                            <label className="control-label" htmlFor="relationship">Relationship:</label>
                            <input type="text" className="form-control" id="relationship" name="relationship" value={ this.state.relationship } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.relationship } />
                        </div>
                        { Object.keys(this.props.cub).length ? <div className="form-group">
                            <label className="control-label" htmlFor="lives_with_cub">Lives with cub:</label>
                            <CheckboxInput name="lives_with_cub" checked={ this.state.lives_with_cub } onChange={ this.handleInputChange } />
                            <ValidationError error={ this.state.validation.lives_with_cub } />
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
})

export default ParentForm;
