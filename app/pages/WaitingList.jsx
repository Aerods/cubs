import React from 'react';
import { Link, browserHistory } from 'react-router';
import Cookies from '../cookies.js';
import * as actions from '../Actions';
import Store from '../store';
import DataTable from '../widgets/DataTable';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

export default class WaitingList extends React.Component {
    constructor() {
        super();
        this.setCubs = this.setCubs.bind(this);
        this.state = {
            cubs: []
        };
    }

    componentWillMount() {
        actions.get({ dataType: 'cub', waiting: 1 });
        // socket.on('cubsUpdate', () => {
        //     actions.get({ dataType: 'cub' });
        // });
        Store.on('cub-get', this.setCubs);
    }

    componentWillUnmount() {
        Store.removeListener('cub-get', this.setCubs);
    }

    setCubs() {
        this.setState({ cubs: Store.data });
    }

    selectCub(cub) {
        browserHistory.push('/cubs/'+cub.id);
    }

    exportData() {
        actions.get({ dataType: 'dataExport' });
    }

    render() {
        var headers = {
            forename: 'First name',
            surname: 'Last name',
            date_of_birth: 'Date of birth',
            invested: 'Invested'
        };
        if (Cookies.section == 'Beavers') {
            headers.six = 'Lodge';
        } else if (Cookies.section == 'Cubs') {
            headers.rank = 'Rank';
            headers.six = 'Six';
        }
        var classes = {
            date_of_birth: '',
            invested: 'hidden-xs hidden-sm',
            rank: 'hidden-xs hidden-sm',
            lodge: 'hidden-xs',
            six: 'hidden-xs'
        };
        return (
            <div id="WaitingList">
                <SubHeader heading="Waiting list">
                    <Link to="/cubs"><span className="nav-button">Back</span></Link>
                    { Cookies.admin ? <Link to="/cubs/new"><span className="nav-button">Add</span></Link> : '' }
                </SubHeader>
                <PageContent>
                    <DataTable headers={ headers } classes={ classes } data={ this.state.cubs } onClick={ this.selectCub } height="tall" />
                </PageContent>
            </div>
        )
    }
}
