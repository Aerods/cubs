import React from 'react';
import Store from '../store';
import * as actions from '../Actions';
import SelectBadge from './SelectBadge';
import Modal from '../widgets/Modal';
import CriteriaList from './CriteriaList';
import DataTable from '../widgets/DataTable';

export default class SelectActivity extends React.Component {
    constructor() {
        super();
        this.setCubs = this.setCubs.bind(this);
        this.setBadges = this.setBadges.bind(this);
        this.state = {
            isModalOpen: false,
            badges: [],
            badge_criteria: [],
            cubs: [],
            badge: {}
        };
    }

    componentWillMount() {
        actions.get({ dataType: 'cub' });
        Store.on('cub-get', this.setCubs);

        actions.get({ dataType: 'badgesWithCriteria' });
        Store.on('badgesWithCriteria-get', this.setBadges);
    }

    componentWillUnmount() {
        Store.removeListener('cub-get', this.setCubs);
        Store.removeListener('badgesWithCriteria-get', this.setBadges);
    }

    setCubs() {
        this.setState({ cubs: Store.data });
    }

    setBadges() {
        var badges = Store.data;
        this.setState({ badges: badges });
    }

    addBadge(badge) {
        this.setState({
            badge: badge,
            badge_criteria: badge.badge_criteria,
            isModalOpen: false
        });
    }

    openModal() {
        this.setState({ isModalOpen: true });
    }
    closeModal() {
        this.setState({ isModalOpen: false });
    }

    clickCriteria(criteria) {
        var badge_criteria = this.state.badge_criteria;
        var new_badge_criteria = [];
        badge_criteria.map(function(b_criteria) {
            if (b_criteria.id == criteria.id) {
                var new_badge_tasks = [];
                b_criteria.badge_tasks.map(function(b_task) {
                    if (b_task.badge_criteria_id == criteria.id) {
                        b_task.selected = !b_criteria.selected;
                    }
                    new_badge_tasks.push(b_task);
                });
                b_criteria.selected = !b_criteria.selected;
                b_criteria.badge_tasks = new_badge_tasks;
            }
            new_badge_criteria.push(b_criteria);
        });
        this.setState({ badge_criteria: new_badge_criteria });
    }

    clickTask(task) {
        var badge_criteria = this.state.badge_criteria;
        var new_badge_criteria = [];
        var allSelected = 1;
        var xSelected = 0;
        badge_criteria.map(function(b_criteria) {
            var new_badge_tasks = [];
            if (task.badge_criteria_id == b_criteria.id) {
                b_criteria.badge_tasks.map(function(b_task) {
                    if (b_task.id == task.id) {
                        b_task.selected = !b_task.selected;
                    }
                    if (!b_task.selected) allSelected = 0;
                    else xSelected ++;
                    new_badge_tasks.push(b_task);
                });
                b_criteria.selected = allSelected;
                if (b_criteria.complete_x && xSelected >= b_criteria.complete_x) b_criteria.selected = 1;
                b_criteria.badge_tasks = new_badge_tasks;
            }
            new_badge_criteria.push(b_criteria);
        });
        this.setState({ badge_criteria: new_badge_criteria });
    }

    selectCub(cub) {
        var cubs = this.state.cubs;
        var new_cubs = [];
        cubs.map(function(new_cub) {
            if (cub.id == new_cub.id) {
                new_cub.selected = !new_cub.selected;
            }
            new_cubs.push(new_cub);
        });
        this.setState({ cubs: new_cubs });
    }

    selectAll() {
        var new_cubs = this.state.cubs.map(function(cub) {
            cub.selected = 1;
            return cub;
        });
        this.setState({ cubs: new_cubs });
    }

    deselectAll() {
        var new_cubs = this.state.cubs.map(function(cub) {
            cub.selected = 0;
            return cub;
        });
        this.setState({ cubs: new_cubs });
    }

    completeActivity() {
        var data = {
            badge_criteria: this.state.badge_criteria,
            cubs: this.state.cubs,
            dataType: 'activity'
        };
        actions.add(data);
        this.props.closeModal();
    }

    render() {
        var badgeName;
        var badge = this.state.badge;
        if (badge.name) {
            badgeName = badge.type == 'Staged' ? (<h4>{ badge.name + ' - stage ' + badge.stage }</h4>) : (<h4>{ badge.name }</h4>);
        }
        var headers = {
            forename: 'First name',
            surname: 'Last name',
            date_of_birth: 'Date of birth'
        };
        return(
            <div id="SelectActivity" className="row">
                <h3>Complete activity</h3>
                <div className="spacer" />

                <a><span className="nav-button" onClick={ this.openModal.bind(this) }>{ this.state.badge_criteria.length ? 'Change badge' : 'Select badge' }</span></a>
                <div className="spacer" />
                { badgeName }

                <Modal isOpen={ this.state.isModalOpen }>
                    <SelectBadge badges={ this.state.badges } addBadge={ this.addBadge.bind(this) } closeModal={ this.closeModal.bind(this) } />
                </Modal>

                <div className="select-activity">
                    <CriteriaList
                        badge_criteria={ this.state.badge_criteria }
                        onClick={ function() {} }
                        clickCriteria={ this.clickCriteria.bind(this) }
                        clickTask={ this.clickTask.bind(this) } />
                </div>
                <div className="spacer" />

                <h4>Cubs</h4>
                <div className="spacer" />
                <a><span className="nav-button" onClick={ this.selectAll.bind(this) }>select all</span></a>
                <a><span className="nav-button" onClick={ this.deselectAll.bind(this) }>deselect all</span></a>
                <div className="spacer" />
                <DataTable headers={ headers } data={ this.state.cubs } onClick={ this.selectCub.bind(this) } height="short" />
                <div className="spacer" />

                <a><span className="nav-button" onClick={ this.props.closeModal.bind(this) }>cancel</span></a>
                <a><span className="nav-button" onClick={ this.completeActivity.bind(this) }>complete</span></a>
            </div>
        )
    }
}
