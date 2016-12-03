import React from 'react';
import { Link, browserHistory } from 'react-router';
import * as actions from '../Actions';
import Store from '../store';
import DataTable from '../widgets/DataTable';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

export default class Cubs extends React.Component {
    constructor() {
        super();
        this.setCubs = this.setCubs.bind(this);
        this.state = {
            cubs: []
        };
    }

    componentWillMount() {
        actions.get({ dataType: 'cub' });
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

    render() {
        var headers = {
            forename: 'First name',
            surname: 'Last name',
            date_of_birth: 'Date of birth',
            invested: 'Invested',
            rank: 'Rank',
            six: 'Six'
        };
        var classes = {
            date_of_birth: '',
            invested: 'hidden-xs hidden-sm',
            rank: 'hidden-xs hidden-sm',
            six: 'hidden-xs'
        };
        return (
            <div id="Cubs">
                <SubHeader heading="Cubs">
                    <Link to="/cubs/new"><span className="nav-button">Add</span></Link>
                    <Link to="/cubs/stats"><span className="nav-button">Stats</span></Link>
                </SubHeader>
                <PageContent>
                    <DataTable headers={ headers } classes={ classes } data={ this.state.cubs } onClick={ this.selectCub } height="tall" />
                </PageContent>
            </div>
        )
    }
}
