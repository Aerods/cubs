import React from 'react';
import Cookies from '../cookies.js';

var ParentGrid = React.createClass({
    getDefaultProps: function() {
        return {
            parents: [],
            onEdit: null,
            onRemove: null,
        }
    },

    render: function() {
        var self = this;
        var parentGrid = this.props.parents.map(function(parent, key) {
            function editParent() {
                if (!parent.remove) self.props.onEdit(parent);
            }
            function removeParent() {
                parent.remove = 1;
                self.props.onRemove(parent);
            }
            return (
                <div key={ key } className="parent-grid-item" onClick={ editParent }>
                    <i className="fa fa-times" onClick={ removeParent }></i>
                    <div className="parent-name">{ parent.title + ' ' + parent.forename + ' ' + parent.surname }</div>
                    <div>{ parent.relationship }</div>
                </div>);
        });
        return (
            <div id="ParentGrid">
                <div className="row">
                    <div className="parent-grid-wrapper">
                        <div className="parent-grid">{ parentGrid }</div>
                    </div>
                </div>
            </div>
        )
    }
});

export default ParentGrid;
