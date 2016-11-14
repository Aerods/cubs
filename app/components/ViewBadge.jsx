import React from 'react';
import { Link, browserHistory } from 'react-router';
import BadgeDisplay from './BadgeDisplay';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';
var actions = require('../Actions');
var store = require('../store');

var ViewBadge = React.createClass({
    getDefaultProps: function() {
      return {
          params: { id: null }
      }
    },

    deleteBadge: function(e) {
        e.preventDefault();
        actions.destroy({ id: this.props.params.id, dataType: 'badge' });
        browserHistory.push('/badges');
    },

    render: function() {
        return(
            <div id="ViewBadge">

                <SubHeader heading="Badges">
                    <Link to="/badges"><span className="nav-button">back</span></Link>
                    <Link to={ "/badges/"+this.props.params.id+"/progress" }><span className="nav-button hidden-xs">Progress</span></Link>
                    { this.props.params.id ? <a><span className="nav-button" onClick={ this.deleteBadge }>Delete</span></a> : '' }
                </SubHeader>
                <div className="spacer"></div>

                <PageContent>
                    <div className="view-sheet">
                        <BadgeDisplay id={ this.props.params.id } />
                    </div>
                </PageContent>
            </div>
        )
    }
})

export default ViewBadge
;
