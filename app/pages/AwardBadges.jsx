import React from 'react';
import PageContent from '../widgets/PageContent';
import DataTable from '../widgets/DataTable';
import SubHeader from '../widgets/SubHeader';
var store = require('../store');
var actions = require('../Actions');

var AwardBadges = React.createClass({
    getInitialState: function() {
      return { cub_badges: [] }
    },

    componentDidMount: function() {
        var self = this;
        store.onChange({ dataType: 'award' }, function(cub_badges) {
            if (self.isMounted()) self.setState({ cub_badges: cub_badges });
        });
    },

    refresh: function () {
        var self = this;
        store.onChange({ dataType: 'refresh_award' }, function(cub_badges) {
            if (self.isMounted()) self.setState({ cub_badges: cub_badges });
        });
    },

    awardCubBadge: function(cub_badge) {
        var cub_badges = this.state.cub_badges;
        var newCubBadges = [];
        cub_badges.map(function(newCubBadge) {
            if (newCubBadge.id == cub_badge.id) {
                newCubBadge.awarded = !cub_badge.awarded;
            }
            newCubBadges.push(newCubBadge);
        });
        cub_badges = newCubBadges;
        this.setState({ cub_badges: cub_badges });
        cub_badge.dataType = 'award';
        actions.update(cub_badge);
    },

    render: function() {
        var self = this;
        var headers = {
            cub_name: 'Cub name',
            badge_name: 'Badge',
            image: 'Image',
            type: 'Type'
        };
        var classes = { type: 'hidden-xs' };
        return(
            <div id="AwardBadges">
                <SubHeader heading="Award badges">
                    <a><span className="nav-button" onClick={ this.refresh }>Refresh</span></a>
                </SubHeader>
                <PageContent>
                    <DataTable headers={ headers } classes={ classes } data={ this.state.cub_badges } onClick={ this.awardCubBadge } height="tall" />
                </PageContent>
           </div>
       )
   }
});

export default AwardBadges;
