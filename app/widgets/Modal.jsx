import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

var Modal = React.createClass({
    render: function() {
        if (this.props.isOpen) {
            return (
                <ReactCSSTransitionGroup transitionName="modal-anim" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                    <div key={this.props.children} className="modal">
                        <div className="modal-content">
                            {this.props.children}
                        </div>
                    </div>
                </ReactCSSTransitionGroup>
            );
        } else {
            return (
                <ReactCSSTransitionGroup transitionName="modal-anim" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                </ReactCSSTransitionGroup>
            );
        }
    }
});
export default Modal;
