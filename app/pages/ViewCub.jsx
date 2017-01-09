import React from 'react';
import { Link, browserHistory } from 'react-router';
import Cookies from '../cookies.js';
import * as actions from '../Actions';
import Store from '../store';
import moment from 'moment';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';
import DataTable from '../widgets/DataTable';
import CubBadgeList from '../components/CubBadgeList';
import Modal from '../widgets/Modal';
import AddCubParent from '../components/AddCubParent';
import SelectBadge from '../components/SelectBadge';
import ParentForm from './ParentForm';
import BadgeGrid from '../components/BadgeGrid';
import BadgeDisplay from '../components/BadgeDisplay';

export default class ViewCub extends React.Component {
    constructor() {
        super();
        this.setCub = this.setCub.bind(this);
        this.setCubParents = this.setCubParents.bind(this);
        this.setAllParents = this.setAllParents.bind(this);
        this.setBadges = this.setBadges.bind(this);
        this.setBadgeProgress = this.setBadgeProgress.bind(this);
        this.state = {
            dataType: 'cub',
            forename: '',
            surname: '',
            date_of_birth: '',
            age: '',
            gender: '',
            rank: '',
            six: '',
            phone: '',
            address_1: '',
            address_2: '',
            address_3: '',
            town: 'Exeter',
            postcode: '',
            start_date: '',
            from_beavers: '',
            invested: '',
            previous_group: '',
            medical_information: '',
            notes: '',
            to_scouts: '',
            all_parents: [],
            cub_parents: [],
            all_badges: [],
            cub_badges: [],
            parent: {},
            isParentModalOpen: false,
            isBadgeModalOpen: false,
            isFormOpen: false
        };
    }

    componentWillMount() {
        actions.get({ dataType: 'cub', id: this.props.params.id });
        Store.on('cub-get', this.setCub);

        actions.get({ dataName: 'cubParents', dataType: 'parent', cub_id: this.props.params.id });
        Store.on('cubParents-get', this.setCubParents);

        actions.get({ dataName: 'allParents', dataType: 'parent', allSections: 1 });
        Store.on('allParents-get', this.setAllParents);

        this.getBadgeProgress();
        Store.on('badgeProgress-get', this.setBadgeProgress);
    }

    componentWillUnmount() {
        Store.removeListener('cub-get', this.setCub);
        Store.removeListener('cubParents-get', this.setCubParents);
        Store.removeListener('allParents-get', this.setAllParents);
        Store.removeListener('badge-get', this.setBadges);
        Store.removeListener('badgeProgress-get', this.setBadgeProgress);
    }

    getBadgeProgress() {
        actions.get({ dataType: 'badge' });
        Store.on('badge-get', this.setBadges);
    }

    setCub() {
        var cub = Store.data[0];
        this.setState({
            forename: cub.forename,
            surname: cub.surname,
            date_of_birth: cub.date_of_birth,
            age: cub.age,
            gender: cub.gender,
            rank: cub.rank,
            six: cub.six,
            phone: cub.phone,
            address_1: cub.address_1,
            address_2: cub.address_2,
            address_3: cub.address_3,
            town: cub.town,
            postcode: cub.postcode,
            start_date: cub.start_date,
            from_beavers: cub.from_beavers,
            invested: cub.invested,
            previous_group: cub.previous_group,
            medical_information: cub.medical_information,
            notes: cub.notes,
            to_scouts: cub.to_scouts
        });
    }
    setCubParents() {
        var cub_parents = Store.data.map( (parent, key) => {
            parent.uuid = key + 1;
            parent.cub_id = this.props.params.id;
            return parent;
        });
        this.setState({ cub_parents: cub_parents });
    }
    setAllParents() {
        this.setState({ all_parents: Store.data });
    }
    setBadges() {
        var badges = Store.data;
        this.setState({ all_badges: badges });
        Store.data.map( (badge) => {
            actions.get({ dataName: 'badgeProgress', dataType: 'badgeProgress', badge_id: badge.id, cub_id: this.props.params.id });
        });
    }
    setBadgeProgress() {
        var progress = Store.data;
        var all_badges = this.state.all_badges.map( (badge) => {
            if (badge.id == Store.data.badge_id) badge.progress = progress.progress;
            return badge;
        });
        this.setState({ all_badges: all_badges });
    }

    deleteCub(e) {
        e.preventDefault();
        var confirmed = confirm("Delete this record?");
        if (confirmed) {
            actions.destroy({ id: this.props.params.id, dataType: 'cub' });
            browserHistory.push('/');
        }
    }

    editParent(parent) {
        this.setState({ parent: parent });
        this.setState({ isFormOpen: true });
    }
    closeForm() {
        this.setState({ isFormOpen: false });
    }

    openParentModal() {
        this.setState({ isParentModalOpen: true });
    }
    openBadgeModal() {
        this.setState({ isBadgeModalOpen: true });
    }
    closeParentModal() {
        this.setState({ isParentModalOpen: false });
    }
    closeBadgeModal(dataChanged) {
        this.setState({ isBadgeModalOpen: false });
        if (dataChanged) {
            this.setState({ all_badges: [] });
            this.getBadgeProgress();
        }
    }

    addParent(parent) {
        var cub_parents = this.state.cub_parents;
        if (parent) {
            if (parent.uuid) {
                var unchangedParents = [];
                cub_parents.map(function(unchangedParent) {
                    if (unchangedParent.uuid != parent.uuid) { unchangedParents.push(unchangedParent); }
                });
                cub_parents = unchangedParents;
            } else {
                parent.uuid = cub_parents.length + 1;
            }
            cub_parents.push(parent);
        }
        this.setState({
            isParentModalOpen: false,
            isFormOpen: false,
            cub_parents: cub_parents
        });
        var cub = this.state;
        cub.id = this.props.params.id;
        cub.parents = cub.cub_parents;
        actions.update(cub);
    }

    addBadge(badge) {
        var cub_badges = this.state.cub_badges;
        badge.badge_id = badge.id;
        badge.id = null;
        cub_badges.push(badge);
        this.setState({
            isBadgeModalOpen: false,
            cub_badges: cub_badges
        });
        var cub = this.state;
        cub.badges = cub.cub_badges;
        actions.update(cub);
    }

    clickBadge(badge) {
        this.setState({
            badge_id: badge.id,
            isBadgeModalOpen: true
        });
    }

    render() {
        var parentHeaders = {
            title: 'Title',
            forename: 'First name',
            surname: 'Last name',
            relationship: 'Relationship'
        };
        var address_3 = (<div>{ this.state.address_3 }</div>);
        return(
            <div id="ViewCub">
                <SubHeader heading={ "View "+Cookies.member }>
                    <Link to="/cubs"><span className="nav-button">back</span></Link>
                    { this.props.params.id ? <a><span className="nav-button" onClick={ this.deleteCub.bind(this) }>Delete</span></a> : '' }
                </SubHeader>
                <PageContent>
                    <div className="spacer"></div>

                    <div className="view-sheet">
                        <div className="view-group">
                            <h3>{ Cookies.member } details</h3>
                            <Link to={ "/cubs/"+this.props.params.id+"/edit" }><span className="nav-button">Edit</span></Link>

                            <div className="view-row">
                                <div className="field-group">
                                    <div className="field-name">Name:</div>
                                    <div className="field-value">{ this.state.forename + ' ' + this.state.surname }</div>
                                </div>
                                <div className="field-group">
                                    <div className="field-name">Start date:</div>
                                    <div className="field-value">{ this.state.start_date }</div>
                                </div>
                            </div>

                            <div className="view-row">
                                <div className="field-group">
                                    <div className="field-name">Date of birth:</div>
                                    <div className="field-value">{ this.state.date_of_birth + " ("+this.state.age+" years old)" }</div>
                                </div>
                                <div className="field-group">
                                    <div className="field-name">Invested:</div>
                                    <div className="field-value">{ this.state.invested }</div>
                                </div>
                            </div>

                            <div className="view-row">
                                <div className="field-group">
                                    <div className="field-name">Gener:</div>
                                    <div className="field-value">{ this.state.gender }</div>
                                </div>
                                <div className="field-group">
                                    <div className="field-name">{ Cookies.section == 'Cubs' ? 'Six:' : 'Lodge:' }</div>
                                    <div className="field-value">{ this.state.six }</div>
                                </div>
                            </div>

                            <div className="view-row">
                                <div className="field-group">
                                    <div className="field-name">Home Phone:</div>
                                    <div className="field-value">{ this.state.phone }</div>
                                </div>
                                { Cookies.section == 'Cubs' ? (
                                    <div className="field-group">
                                        <div className="field-name">Rank:</div>
                                        <div className="field-value">{ this.state.rank || '-' }</div>
                                    </div>
                                ) : (
                                    <div className="field-group">
                                        <div className="field-name">To Cubs:</div>
                                        <div className="field-value">{ this.state.to_cubs || '-' }</div>
                                    </div>
                                ) }
                            </div>

                            <div className="view-col">
                                <div className="field-group tall">
                                    <div className="field-name">Address:</div>
                                    <div className="field-value">
                                        <div>{ this.state.address_1 }</div>
                                        <div>{ this.state.address_2 }</div>
                                        { this.state.address_3 ? address_3 : '' }
                                        <div>{ this.state.town }</div>
                                        <div>{ this.state.postcode }</div>
                                    </div>
                                </div>
                            </div>

                            <div className="view-col">
                                <div className="field-group">
                                    <div className="field-name">Previous group:</div>
                                    <div className="field-value">{ this.state.previous_group || '-' }</div>
                                </div>
                                { Cookies.section == 'Cubs' ? (
                                    <div className="field-group">
                                        <div className="field-name">From Beavers:</div>
                                        <div className="field-value">{ this.state.from_beavers || '-' }</div>
                                    </div>
                                ) : '' }
                                { Cookies.section == 'Cubs' ? (
                                    <div className="field-group">
                                        <div className="field-name">To Scouts:</div>
                                        <div className="field-value">{ this.state.to_scouts || '-' }</div>
                                    </div>
                                ) : '' }
                            </div>

                            <div className="view-row">
                                <div className="field-group wide">
                                    <div className="field-name">Medical info:</div>
                                    <div className="field-value wide">{ this.state.medical_information || '-' }</div>
                                </div>
                            </div>

                            <div className="view-row">
                                <div className="field-group wide">
                                    <div className="field-name">Notes:</div>
                                    <div className="field-value wide">{ this.state.notes || '-' }</div>
                                </div>
                            </div>
                        </div>

                        <div className="view-group">
                            <h3>Parents</h3>

                            <div className="form-buttons">
                                <a><span className="nav-button" onClick={ this.openParentModal.bind(this) }>Add</span></a>
                            </div>

                            <Modal isOpen={ this.state.isParentModalOpen }>
                                <AddCubParent parents={ this.state.all_parents } cub={ this.state } addParent={ this.addParent.bind(this) } closeModal={ this.closeParentModal.bind(this) } />
                            </Modal>
                            <Modal isOpen={ this.state.isFormOpen }>
                                <ParentForm onClose={ this.closeForm.bind(this) } onSave={ this.addParent.bind(this) } parent={ this.state.parent } params={ {} } />
                            </Modal>

                            <DataTable
                                headers={ parentHeaders }
                                classes={ {title: 'hidden-xs', relationship: 'hidden-xs'} }
                                data={ this.state.cub_parents }
                                onClick={ this.editParent.bind(this) }
                                search={ false } />
                        </div>

                        <div className="view-group">
                            <Modal isOpen={ this.state.isBadgeModalOpen }>
                                <BadgeDisplay id={ this.state.badge_id } closeModal={ this.closeBadgeModal.bind(this) } cub_id={ this.props.params.id } />
                            </Modal>

                            <h3>Badges</h3>

                            <BadgeGrid badges={ this.state.all_badges } showProgress={ true } onClick={ this.clickBadge.bind(this) } />
                        </div>
                    </div>
                </PageContent>
            </div>
        )
    }
}
