import React from 'react';

var ValidationError = React.createClass({
    getInitialProps: function () {
        return {
            error: null
        };
    },
    render: function () {
        return (
            <div className="ValidationError">
                { this.props.error ? <div className="validation-error">{ this.props.error }</div> : '' }
            </div>
        );
    }
});
export default ValidationError;
