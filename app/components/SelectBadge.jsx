import React from 'react';
import DataTable from '../widgets/DataTable';

var SelectBadge = React.createClass({
    getDefaultProps: function() {
        return {
            badges: [],
            addBadge: null,
            closeModal: null
        }
    },

    getInitialState: function() {
        return {
            isFormOpen: false
        }
    },

    handleClick: function(id) {
        this.props.onClick(id);
    },

    render: function() {
        var self = this;
        var badges = this.props.badges.map(function(badge, key) {
            function clickBadge() {
                self.props.addBadge(badge);
            }
            return (
                <tr key={ key } onClick={ clickBadge }>
                    <td>{ badge.name }</td>
                    <td>{ badge.type }</td>
                    <td>{ badge.stage }</td>
                </tr>
            );
        });

        var headers = {
            name: 'Name',
            type: 'Type',
            stage: 'Stage'
        };
        return(
            <div id="SelectBadge" className="row">
                <h4>Add badge</h4>
                <div className="spacer" />

                <DataTable headers={ headers } data={ this.props.badges } onClick={ this.props.addBadge } height="short" />

                <div className="spacer" />
                <a><span className="nav-button" onClick={ this.props.closeModal }>cancel</span></a>
           </div>
       )
   }
});

export default SelectBadge;
