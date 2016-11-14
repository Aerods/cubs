import React from 'react';
import { browserHistory, Link } from 'react-router';
var store = require('../store');
import DataTable from '../widgets/DataTable';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

var Programme = React.createClass({
    getInitialState: function() {
      return { programme: [] }
    },

    componentDidMount: function() {
        var self = this;
        this.getData();
        socket.on('programmeUpdate', function () {
            self.getData();
        });
    },

    getData: function() {
        var self = this;
        store.onChange({ dataType: 'programme' }, function(programme) {
            if (self.isMounted()) self.setState({ programme: programme });
        });
    },

    handleClick: function(meeting) {
        if (this.props.onClick) {
            this.props.onClick(meeting);
        } else {
            browserHistory.push('/programme/'+meeting.id+'/edit');
        }
    },

    render: function() {
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
        return (
            <div id="Programme">
                <SubHeader heading="Programme">
                    <Link to="/programme/new"><span className="nav-button">Add</span></Link>
                </SubHeader>
                <PageContent>
                    <DataTable headers={ headers } classes={ classes } data={ this.state.programme } onClick={ this.handleClick } height="tall" />
                </PageContent>
            </div>
        )
    }
});

export default Programme;
