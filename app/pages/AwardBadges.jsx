import React from 'react';
import PageContent from '../widgets/PageContent';
import DataTable from '../widgets/DataTable';
import SubHeader from '../widgets/SubHeader';
import Store from '../store';
import * as actions from '../Actions';
import Cookies from '../cookies.js';

export default class AwardBadges extends React.Component {
    constructor() {
        super();
        this.setBadges = this.setBadges.bind(this);
        this.state = {
            cub_badges: [],
            refreshing: false
        }
    }

    componentWillMount() {
        actions.get({ dataType: 'award' });
        Store.on('award-get', this.setBadges);
        Store.on('refresh_award-get', this.setBadges);
    }

    componentWillUnmount() {
        Store.removeListener('award-get', this.setBadges);
        Store.removeListener('refresh_award-get', this.setBadges);
    }

    setBadges() {
        this.setState({ cub_badges: Store.data, refreshing: false });
    }

    refresh() {
        if (!this.state.refreshing) {
            this.setState({ refreshing: true });
            actions.get({ dataType: 'refresh_award' });
        }
    }

    awardCubBadge(cub_badge) {
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
    }

    render() {
        var headers = {
            cub_name: Cookies.member + ' name',
            badge_name: 'Badge',
            image: 'Image',
            type: 'Type'
        };
        var classes = { type: 'hidden-xs' };
        return(
            <div id="AwardBadges">
                <SubHeader heading="Award badges">
                    <a><span className="nav-button" onClick={ this.refresh.bind(this) }>Refresh</span></a>
                    { this.state.refreshing ? <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i> : '' }
                </SubHeader>
                <PageContent>
                    <DataTable headers={ headers } classes={ classes } data={ this.state.cub_badges } onClick={ this.awardCubBadge.bind(this) } height="tall" />
                </PageContent>
           </div>
       )
   }
}
