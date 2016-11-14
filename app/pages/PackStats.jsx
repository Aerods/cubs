import React from 'react';
import { Link, browserHistory } from 'react-router';
var store = require('../store');
var actions = require('../Actions');
import DataTable from '../widgets/DataTable';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

var PackStats = React.createClass({
    getInitialState: function() {
      return { stats: [] }
    },

    componentDidMount: function() {
        var self = this;
        store.onChange({ dataType: 'stats' }, function(stats) {
            if (self.isMounted()) self.setState({ stats: stats });
        });
    },

    render: function() {
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
});

export default PackStats;
