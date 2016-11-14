import React from 'react';
import { Link, browserHistory } from 'react-router';
var store = require('../store');
import DataTable from '../widgets/DataTable';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

var Cubs = React.createClass({
    getInitialState: function() {
      return { cubs: [] }
    },

    componentDidMount: function() {
        var self = this;
        this.getData();
        socket.on('cubsUpdate', function () {
            self.getData();
        });
    },

    getData: function() {
        var self = this;
        store.onChange({ dataType: 'cub' }, function(cubs) {
            if (self.isMounted()) self.setState({ cubs: cubs });
        });
    },

    selectCub: function(cub) {
        browserHistory.push('/cubs/'+cub.id);
    },

    render: function() {
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
});

export default Cubs;
