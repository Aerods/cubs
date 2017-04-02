import React from 'react';
import ValidationError from './ValidationError';
import SelectInput from '../widgets/SelectInput';

var FormGroup = React.createClass({
    getDefaultProps: function() {
        return {
            name: '',
            label: '',
            type: 'text',
            value: '',
            onChange: null,
            error: null,
            data: null,
        }
    },

    render: function () {
        var label = this.props.label;
        var name = this.props.name;
        if (!label) {
            label = name.charAt(0).toUpperCase() + name.slice(1);
            label = label.replace(/_/g, ' ');
            label += ':';
        }
        var type = this.props.type;
        var classes = "form-control";
        if (type == 'small') {
            type = 'text';
            classes += ' small';
        }
        if (type == 'text' || type == 'password') {
            return (
                <div className="form-group">
                    <label className="control-label" htmlFor={ this.props.name }>{ label }</label>
                    <input type={ this.props.type } className={ classes } id={ name } name={ name } value={ this.props.value } onChange={ this.props.onChange } />
                    { this.props.labelRight ? (
                        <label className="control-label-right">{ this.props.labelRight }</label>
                    ) : '' }
                    <ValidationError error={ this.props.error } />
                </div>
            );
        } else if (type == 'select') {
            return (
                <div className="form-group">
                    <label className="control-label" htmlFor={ name }>{ label }</label>
                    <SelectInput
                        data={ this.props.data }
                        selected={ this.props.value }
                        name={ name }
                        onChange={ this.props.onChange } />
                    <ValidationError error={ this.props.error } />
                </div>
            );
        } else if (type == 'textarea') {
            type = 'text';
            return (
                <div className="form-group">
                    <label className="control-label" htmlFor={ this.props.name }>{ label }</label>
                    <textarea type={ this.props.type } className={ classes } id={ name } name={ name } value={ this.props.value } onChange={ this.props.onChange } />
                    <ValidationError error={ this.props.error } />
                </div>
            );
        }
    }
});
export default FormGroup;
