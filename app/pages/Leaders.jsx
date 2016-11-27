import React from 'react';
import { browserHistory, Link } from 'react-router';
import * as actions from '../Actions';
import Store from '../store';
import DataTable from '../widgets/DataTable';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

export default class Leaders extends React.Component {
    constructor() {
        super();
        this.setLeaders = this.setLeaders.bind(this);
        this.state = {
            leaders: []
        };
    }

    componentWillMount() {
        actions.get({ dataType: 'leader' });
        socket.on('leadersUpdate', () => {
            actions.get({ dataType: 'leader' });
        });
        Store.on('leader-get', this.setLeaders);
    }

    componentWillUnmount() {
        Store.removeListener('leader-get', this.setLeaders);
    }

    setLeaders() {
        this.setState({ leaders: Store.data });
    }


    handleClick(leader) {
        browserHistory.push('/leaders/'+leader.id+'/edit');
    }

    render() {
        var headers = {
            title: 'Title',
            forename: 'First name',
            surname: 'Last name',
            position: 'Position',
            cub_name: 'Cub name'
        };
        var classes = {
            title: 'hidden-xs',
            position: 'hidden-xs'
        };
        return (
            <div id="Leaders">
                <SubHeader heading="Leaders">
                    <Link to="/leaders/new"><span className="nav-button">Add</span></Link>
                </SubHeader>
                <PageContent>
                    <DataTable headers={ headers } classes={ classes } data={ this.state.leaders } onClick={ this.handleClick.bind(this) } height="tall" />
                </PageContent>
            </div>
        )
    }
}
