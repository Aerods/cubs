import React from 'react';
import { Link, browserHistory } from 'react-router';
var store = require('../store');
import Modal from '../widgets/Modal';
import SelectActivity from '../components/SelectActivity';
import BadgeGrid from '../components/BadgeGrid';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';

var Badges = React.createClass({
    getInitialState: function() {
        return {
            badges: [],
            isModalOpen: false
        }
    },

    componentDidMount: function() {
        var self = this;
        this.getData();
        socket.on('badgesUpdate', function () {
            self.getData();
        });
    },

    getData: function() {
        var self = this;
        store.onChange({ dataType: 'badge' }, function(badges) {
            if (self.isMounted()) self.setState({ badges: badges });
        });
    },

    addActivity: function() {
    },

    openModal: function() {
        this.setState({ isModalOpen: true });
    },
    closeModal: function() {
        this.setState({ isModalOpen: false });
    },

    handleClick: function(badge) {
        browserHistory.push('/badges/'+badge.id);
    },

    render: function() {
        return (
            <div id="Badges">
                <SubHeader heading="Badges">
                    <Link to="/badges/new"><span className="nav-button">Add</span></Link>
                    <a><span className="nav-button hidden-sm hidden-md hidden-lg" onClick={ this.openModal }>Activity</span></a>
                    <a><span className="nav-button hidden-xs" onClick={ this.openModal }>Complete activity</span></a>
                    <Link to="/badges/progress"><span className="nav-button hidden-xs hidden-sm">Badge progress</span></Link>
                </SubHeader>

                <PageContent>
                    <BadgeGrid badges={ this.state.badges } onClick={ this.handleClick } search={ true } />

                    <Modal isOpen={ this.state.isModalOpen }>
                        <SelectActivity addActivity={ this.addActivity } closeModal={ this.closeModal } />
                    </Modal>
                </PageContent>
            </div>
        )
    }
});

export default Badges;
