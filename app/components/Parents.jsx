import React from 'react';
import { browserHistory, Link } from 'react-router';
var store = require('../store');
import PageContent from '../widgets/PageContent';
import DataTable from '../widgets/DataTable';
import SubHeader from '../widgets/SubHeader';

var Parents = React.createClass({
    getInitialState: function() {
      return { parents: [] }
    },

    componentDidMount: function() {
        var self = this;
        this.getData();
        socket.on('parentsUpdate', function () {
            self.getData();
        });
    },

    getData: function() {
        var self = this;
        store.onChange({ dataType: 'parent' }, function(parents) {
            if (self.isMounted()) self.setState({ parents: parents });
        });
    },

    handleClick: function(parent) {
        if (this.props.onClick) {
            this.props.onClick(parent);
        } else {
            browserHistory.push('/parents/'+parent.id+'/edit');
        }
    },

    render: function() {
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
                    <Link to="/parents/new"><span className="nav-button">Add</span></Link>
                </SubHeader>
                <PageContent>
                    <DataTable headers={ headers } classes={ classes } data={ this.state.parents } onClick={ this.handleClick } height="tall" />
                </PageContent>
            </div>
        )
    }
});

export default Parents;
