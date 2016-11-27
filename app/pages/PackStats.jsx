import React from 'react';
import { Link, browserHistory } from 'react-router';
import * as actions from '../Actions';
import Store from '../store';
import DataTable from '../widgets/DataTable';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

export default class PackStats extends React.Component {
    constructor() {
        super();
        this.setStats = this.setStats.bind(this);
        this.state = {
            stats: []
        };
    }

    componentWillMount() {
        actions.get({ dataType: 'stats' });
        Store.on('stats-get', this.setStats);
    }

    componentWillUnmount() {
        Store.removeListener('stats-get', this.setStats);
    }

    setStats() {
        this.setState({ stats: Store.data });
    }

    render() {
        var headers = {
            group_name: 'Group',
            count: 'Number of cubs',
            age: 'Average age',
            badges: 'Average badges'
        };
        return(
            <div id="PackStats">
                <SubHeader heading="Pack statistics">
                    <Link to="/"><span className="nav-button">back</span></Link>
                </SubHeader>
                <PageContent>
                    <DataTable headers={ headers } data={ this.state.stats } height="tall" search={ 0 } />
                </PageContent>
            </div>
        )
   }
}
