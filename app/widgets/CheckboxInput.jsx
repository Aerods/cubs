import React from 'react';

var CheckboxInput = React.createClass({
    getInitialState: function () {
        return {
            checked: this.props.checked || 0
        };
    },
    uncheckBox: function() {
        this.setState({ checked: 0 });
        this.props.onChange({
            target: {
                name: this.props.name,
                value: 0
            }
        });
    },
    checkBox: function() {
        this.setState({ checked: 1 });
        this.props.onChange({
            target: {
                name: this.props.name,
                value: 1
            }
        });
    },
    render: function () {
        return (
            <span>
                { this.props.checked ?
                    (<i className="fa fa-check-square-o checkbox" onClick={ this.uncheckBox }></i>)
                :
                    (<i className="fa fa-square-o checkbox" onClick={ this.checkBox }></i>)
                }
                <input type="hidden"
                    name={ this.props.name }
                    checked={ this.state.checked }
                    value={ this.state.checked } />
                { this.props.label }
            </span>
        );
    }
});
export default CheckboxInput;
