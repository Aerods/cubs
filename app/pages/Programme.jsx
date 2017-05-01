import React from 'react';
import { Link, browserHistory } from 'react-router';
import * as actions from '../Actions';
import Store from '../store';
import DataTable from '../widgets/DataTable';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';
import Cookies from '../cookies.js';

export default class Programme extends React.Component {
    constructor() {
        super();
        this.setProgramme = this.setProgramme.bind(this);
        this.state = {
            programme: []
        };
    }

    componentWillMount() {
        actions.get({ dataType: 'programme' });
        socket.on('programmeUpdate', () => {
            actions.get({ dataType: 'programme' });
        });
        Store.on('programme-get', this.setProgramme);
    }

    componentWillUnmount() {
        Store.removeListener('programme-get', this.setProgramme);
    }

    setProgramme() {
        this.setState({ programme: Store.data });
    }

    handleClick(meeting) {
        if (this.props.onClick) {
            this.props.onClick(meeting);
        } else {
            browserHistory.push('/programme/'+meeting.id+'/edit');
        }
    }

    render() {
        var headers = {
            date: 'Date',
            title: 'Title',
            type: 'Type',
            start_time: 'Start time',
            end_time: 'End time'
        };
        var classes = {
            type: 'hidden-xs',
            start_time: 'hidden-xs',
            end_time: 'hidden-xs hidden-sm'
        };
        var filtering = [
            { field: 'old', label: 'Show old meetings', type: 'checkbox', value: 0 }
        ];
        return (
            <div id="Programme">
                <SubHeader heading="Programme">
                    { Cookies.admin ? <Link to="/programme/new"><span className="nav-button">Add</span></Link> : '' }
                </SubHeader>
                <PageContent>
                    <DataTable
                        headers={ headers }
                        classes={ classes }
                        filtering={ filtering }
                        data={ this.state.programme }
                        onClick={ Cookies.leader_id ? this.handleClick.bind(this) : '' }
                        height="tall" />
                </PageContent>
            </div>
        )
    }
}
