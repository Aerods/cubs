import React from 'react';

var CheckboxInput = React.createClass({
    getInitialState: function () {
        return {
            checked: this.props.checked || false
        };
    },
    handleClick: function(e) {
        this.setState({ checked: e.target.checked });
        this.props.onChange(e);
    },
    solveReactError: function(e) {
    },
    render: function () {
        return (
            <span>
                <input type="checkbox"
                    name={ this.props.name }
                    checked={ this.state.checked }
                    onClick={ this.handleClick }
                    onChange={ this.solveReactError }
                    className="checkbox"
                    value={ this.props.value } />
                { this.props.label }
            </span>
        );
    }
});
export default CheckboxInput;
