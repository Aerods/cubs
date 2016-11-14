import React from 'react';

var SelectInput = React.createClass({
    getInitialState: function () {
        return {
            showOptions: false,
            selected: this.props.selected
        };
    },
    handleClick: function() {
        this.setState({ showOptions: !this.state.showOptions });
    },
    render: function () {
        var self = this;
        var options = self.props.data.map(function(option, key) {
            function clickOption() {
                self.setState({ selected: option });
                var e = { target: {name: self.props.name, value: option} };
                self.props.onChange(e);
            }
            return (
                <div key={ key } className="option" onClick={ clickOption }>{ option }</div>
            );
         });
        return (
            <div className="SelectInput form-control small" onClick={ this.handleClick }>
                <div className="selected">
                    <span>{ this.props.selected ? this.props.selected : 'Select...' }</span>
                    { this.state.showOptions ? <i className="fa fa-angle-up fa-lg"></i> : <i className="fa fa-angle-down fa-lg"></i> }
                </div>
                { this.state.showOptions ? <div className="options">{ options }</div> : '' }
            </div>
        );
    }
});
export default SelectInput;
