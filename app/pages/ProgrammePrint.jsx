import React from 'react';
import { browserHistory, Link } from 'react-router';
import * as actions from '../Actions';
import Store from '../store';
import DataTable from '../widgets/DataTable';

export default class ProgrammePrint extends React.Component {
    constructor() {
        super();
        this.setCubs = this.setCubs.bind(this);
        this.setMeeting = this.setMeeting.bind(this);
        this.state = {
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
    }

    componentWillMount() {
        actions.get({ dataType: 'cub' });
        actions.get({ dataType: 'programme', id: this.props.params.id });
        Store.on('cub-get', this.setCubs);
        Store.on('programme-get', this.setMeeting);
    }

    componentWillUnmount() {
        Store.removeListener('cub-get', this.setCubs);
        Store.removeListener('programme-get', this.setMeeting);
    }

    setMeeting() {
        var meeting = Store.data[0];
        this.setState({
            date: meeting.date,
            title: meeting.title,
            type: meeting.type,
            location: meeting.location,
            details: meeting.details,
            start_time: meeting.start_time,
            end_time: meeting.end_time,
            end_date: meeting.end_date
        });
    }

    setCubs() {
        this.setState({ cubs: Store.data });
    }

    render() {
        var cubs = this.state.cubs.map(function(cub, key) {
            return (<tr key={ key } className="cub"><td width="200">{ cub.forename + ' ' + cub.surname }</td><td width="200"></td><td width="200"></td></tr>);
        });
        // var leaders = self.state.leaders.map(function(leader, key) {
        //     return (<tr key={ key } className="leader"><td width="300">{ leader.forename + ' ' + leader.surname }</td><td width="300"></td></tr>);
        // });
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
}
