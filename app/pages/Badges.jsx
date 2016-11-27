import React from 'react';
import { Link, browserHistory } from 'react-router';
import * as actions from '../Actions';
import Store from '../store';
import Modal from '../widgets/Modal';
import SelectActivity from '../components/SelectActivity';
import BadgeGrid from '../components/BadgeGrid';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

export default class Badges extends React.Component {
    constructor() {
        super();
        this.setBadges = this.setBadges.bind(this);
        this.state = {
            badges: [],
            isModalOpen: false
        };
    }
    componentWillMount() {
        actions.get({ dataType: 'badge' });
        socket.on('badgesUpdate', () => {
            actions.get({ dataType: 'badge' });
        });
        Store.on('badge-get', this.setBadges);
    }

    componentWillUnmount() {
        Store.removeListener('badge-get', this.setBadges);
    }

    setBadges() {
        this.setState({ badges: Store.data });
    }

    openModal() {
        this.setState({ isModalOpen: true });
    }
    closeModal() {
        this.setState({ isModalOpen: false });
    }
    handleClick(badge) {
        browserHistory.push('/badges/'+badge.id);
    }

    render() {
        return (
            <div id="Badges">
                <SubHeader heading="Badges">
                    <Link to="/badges/new"><span className="nav-button">Add</span></Link>
                    <a><span className="nav-button hidden-sm hidden-md hidden-lg" onClick={ this.openModal.bind(this) }>Activity</span></a>
                    <a><span className="nav-button hidden-xs" onClick={ this.openModal.bind(this) }>Complete activity</span></a>
                    <Link to="/badges/progress"><span className="nav-button hidden-xs hidden-sm">Badge progress</span></Link>
                </SubHeader>

                <PageContent>
                    <BadgeGrid badges={ this.state.badges } onClick={ this.handleClick.bind(this) } search={ true } />

                    <Modal isOpen={ this.state.isModalOpen }>
                        <SelectActivity closeModal={ this.closeModal.bind(this) } />
                    </Modal>
                </PageContent>
            </div>
        )
    }
}
