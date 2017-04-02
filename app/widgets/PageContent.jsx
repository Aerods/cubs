import React from 'react';
var OnResize = require("react-window-mixins").OnResize;

var PageContent = React.createClass({
    mixins: [ OnResize ],
    render: function () {
        if (this.props.isModal) {
            return (
                <div className="model-content">{ this.props.children }</div>
            );
        } else {
            var contentHeight = (this.state.window.width < 520 ? this.state.window.height-55 : this.state.window.height-85)
            if (this.props.apply) contentHeight += 45;
            return (
                <div id="PageContent" style={ {height:contentHeight} }>
                    <div className="container">{ this.props.children }</div>
                </div>
            );
        }
    }
});
export default PageContent;
