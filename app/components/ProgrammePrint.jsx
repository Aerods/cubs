import React from 'react';
import { browserHistory, Link } from 'react-router';
var store = require('../store');
import DataTable from '../widgets/DataTable';

var ProgrammePrint = React.createClass({
    getDefaultProps: function() {
        return {
            params: { id: null }
        }
    },
    getInitialState: function() {
        return {
            id: this.props.params.id,
            date: null,
            title: null,
            type: null,
            location: null,
            details: null,
            start_time: null,
            end_time: null,
            end_date: null,
            cubs: [],
            leaders: []
        }
    },

    componentDidMount: function() {
        var self = this;
        store.onChange({ dataType: 'programme', id: this.props.params.id }, function(programme) {
            var meeting = programme[0];
            self.setState({
                date: meeting.date,
                title: meeting.title,
                type: meeting.type,
                location: meeting.location,
                details: meeting.details,
                start_time: meeting.start_time,
                end_time: meeting.end_time,
                end_date: meeting.end_date
            });
        });
        store.onChange({ dataType: 'cub', orderBy: 'name' }, function(cubs) {
            self.setState({ cubs: cubs });
        });
        store.onChange({ dataType: 'leader' }, function(leaders) {
            self.setState({ leaders: leaders });
        });
    },

    render: function() {
        var self = this;
        var cubs = self.state.cubs.map(function(cub, key) {
            return (<tr key={ key } className="cub"><td width="200">{ cub.forename + ' ' + cub.surname }</td><td width="200"></td><td width="200"></td></tr>);
        });
        var leaders = self.state.leaders.map(function(leader, key) {
            return (<tr key={ key } className="leader"><td width="300">{ leader.forename + ' ' + leader.surname }</td><td width="300"></td></tr>);
        });
        return (
            <div id="ProgrammePrint">
                <div id="sign-in-sheet">
                    <h3><span>Sign-in Sheet</span><span className="meeting-details">{ this.state.title + ' - ' + this.state.date }</span></h3>
                    <table className="cub-list">
                        <thead>
                            <tr>
                                <td width="200">Cub</td>
                                <td width="200">In</td>
                                <td width="200">Out</td>
                            </tr>
                        </thead>
                        <tbody>{ cubs }</tbody>
                    </table>
                </div>
            </div>
        )
    }
});

export default ProgrammePrint;
