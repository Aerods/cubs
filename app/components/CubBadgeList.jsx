import React from 'react';
import { browserHistory } from 'react-router';

var CubBadgeList = React.createClass({
    getDefaultProps: function() {
      return {
          cub_badges: [],
          onClick: null
      }
    },
    render: function() {
        var self = this;
        var cub_badges = this.props.cub_badges.map(function(cub_badge, key) {
            function clickCubBadge() {
                self.props.onClick(cub_badge);
            }
            return (
                <tr key={ key } onClick={ clickCubBadge }>
                    <td>{ cub_badge.name }</td>
                    <td>{ cub_badge.type }</td>
                    <td>{ cub_badge.stage }</td>
                    <td>{ cub_badge.awarded ? 'Yes' : 'No' }</td>
                </tr>
            );
         });
        return(
            <div id="CubBadgeList" className="row">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Stage</th>
                            <th>Awarded</th>
                        </tr>
                    </thead>
                    <tbody>
                        { cub_badges }
                    </tbody>
                </table>
           </div>
       )
   }
});

export default CubBadgeList;
