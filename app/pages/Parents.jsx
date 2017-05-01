import React from 'react';
import { browserHistory, Link } from 'react-router';
import * as actions from '../Actions';
import Store from '../store';
import PageContent from '../widgets/PageContent';
import DataTable from '../widgets/DataTable';
import SubHeader from '../widgets/SubHeader';
import Cookies from '../cookies.js';

export default class Parents extends React.Component {
    constructor() {
        super();
        this.setParents = this.setParents.bind(this);
        this.state = {
            parents: []
        };
    }

    componentWillMount() {
        actions.get({ dataType: 'parent' });
        socket.on('parentsUpdate', () => {
            actions.get({ dataType: 'parent' });
        });
        Store.on('parent-get', this.setParents);
    }

    componentWillUnmount() {
        Store.removeListener('parent-get', this.setParents);
    }

    setParents() {
        this.setState({ parents: Store.data });
    }

    handleClick(parent) {
        browserHistory.push('/parents/'+parent.id+'/edit');
    }

    render() {
        var headers = {
            title: 'Title',
            forename: 'First name',
            surname: 'Last name',
            relationship: 'Relationship'
        };
        var classes = {
            title: 'hidden-xs',
            relationship: 'hidden-xs'
        };
        return (
            <div id="Parents">
                <SubHeader heading="Parents">
                    { Cookies.admin ? (<Link to="/parents/new"><span className="nav-button">Add</span></Link>) : '' }
                </SubHeader>
                <PageContent>
                    <DataTable headers={ headers } classes={ classes } data={ this.state.parents } onClick={ this.handleClick.bind(this) } height="tall" />
                </PageContent>
            </div>
        )
    }
}
