import React from 'react';
import { browserHistory, Link } from 'react-router';
var store = require('../store');
import DataTable from '../widgets/DataTable';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

var Leaders = React.createClass({
    getInitialState: function() {
      return { leaders: [] }
    },

    componentDidMount: function() {
        var self = this;
        this.getData();
        socket.on('leadersUpdate', function () {
            self.getData();
        });
    },

    getData: function() {
        var self = this;
        store.onChange({ dataType: 'leader' }, function(leaders) {
            if (self.isMounted()) self.setState({ leaders: leaders });
        });
    },

    handleClick: function(leader) {
        if (this.props.onClick) {
            this.props.onClick(leader);
        } else {
            browserHistory.push('/leaders/'+leader.id+'/edit');
        }
    },

    render: function() {
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
                    <DataTable headers={ headers } classes={ classes } data={ this.state.leaders } onClick={ this.handleClick } height="tall" />
                </PageContent>
            </div>
        )
    }
});

export default Leaders;
