import React from 'react';
import { browserHistory } from 'react-router';

var CriteriaList = React.createClass({
    getDefaultProps: function() {
        return {
            badge_criteria: [],
            onClick: null,
            clickCriteria: null,
            clickTask: null
        }
    },
    render: function() {
        var self = this;
        function compare(a, b) {
            if (a.ordering < b.ordering) return -1;
            if (a.ordering > b.ordering) return 1;
            return 0;
        }
        var badge_criteria = this.props.badge_criteria;
        badge_criteria.sort(compare);

        badge_criteria = this.props.badge_criteria.map(function(criteria, key) {
            var badge_tasks = criteria.badge_tasks;
            badge_tasks.sort(compare);
            badge_tasks = criteria.badge_tasks.map(function(task, key) {
                function clickTask() {
                    if (self.props.clickTask) self.props.clickTask(task);
                }
               if (!task.deleted) return (<li key={ key } className={ task.selected ? 'selected' : '' } onClick={ clickTask }>{ task.task }</li>);
            });
            function onClick() {
                if (self.props.onClick) self.props.onClick(criteria);
            }
            function clickCriteria() {
                if (self.props.clickCriteria) self.props.clickCriteria(criteria);
            }

            // Display appropriate criteria text if user entered text is not present
            var criteriaText = criteria.text;
            if (criteria.complete_all == '0') criteria.complete_all = 0;
            if (!criteria.text && criteria.complete_all) {
                criteriaText = 'Complete all of the following:';
            } else if (!criteria.text) {
                criteriaText = 'Complete '+ criteria.complete_x +' of the following:';
            }

            // Show only the task itself if only one task present
            if (criteria.badge_tasks.length == 1 && !criteria.text) criteriaText = criteria.badge_tasks[0].task;

            if (!criteria.deleted) return (
                <li key={ key } onClick={ onClick }>
                    <span className={ criteria.selected ? 'selected' : '' } onClick={ clickCriteria }>{ criteriaText }</span>
                    { criteria.badge_tasks.length > 1 || criteria.text ? <ul>{ badge_tasks }</ul> : '' }
                </li>
            );
        });
        return(
            <div id="CriteriaList" className="row">
                <ol>
                    { badge_criteria }
                </ol>
           </div>
       )
   }
});

export default CriteriaList;
