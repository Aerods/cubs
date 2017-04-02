import React from 'react';
import { Link, browserHistory } from 'react-router';
import Cookies from '../cookies.js';
import * as actions from '../Actions';
import Store from '../store';
import PageContent from '../widgets/PageContent';
import SubHeader from '../widgets/SubHeader';
import Modal from '../widgets/Modal';

export default class ViewLeader extends React.Component {
    constructor() {
        super();
        this.setLeader = this.setLeader.bind(this);
        this.state = {
            dataType: 'leader',
            title: '',
            forename: '',
            surname: '',
            position: '',
            cub_name: '',
            phone_1: '',
            phone_2: '',
            email: '',
            address_1: '',
            address_2: '',
            address_3: '',
            town: 'Exeter',
            postcode: ''
        };
    }

    componentWillMount() {
        actions.get({ dataType: 'leader', id: this.props.params.id });
        Store.on('leader-get', this.setLeader);
    }

    componentWillUnmount() {
        Store.removeListener('leader-get', this.setLeader);
    }

    setLeader() {
        var leader = Store.data[0];
        this.setState({
            forename: leader.forename,
            surname: leader.surname,
            cub_name: leader.cub_name,
            position: leader.position,
            email: leader.email,
            phone_1: leader.phone_1,
            phone_2: leader.phone_2,
            address_1: leader.address_1,
            address_2: leader.address_2,
            address_3: leader.address_3,
            town: leader.town,
            postcode: leader.postcode
        });
    }

    deleteLeader(e) {
        e.preventDefault();
        var confirmed = confirm("Delete this record?");
        if (confirmed) {
            actions.destroy({ id: this.props.params.id, dataType: 'leader' });
            browserHistory.push('/leaders');
        }
    }

    render() {
        var address_3 = (<div>{ this.state.address_3 }</div>);
        var positions = {
            SL: 'Scout Leader',
            CSL: 'Cub Scout Leader',
            BSL: 'Beaver Scout Leader',
            ASL: 'Assistant Scout Leader',
            ACSL: 'Assistant Cub Scout Leader',
            ABSL: 'Assistant Beaver Scout Leader',
            SA: 'Section Assistant',
            OH: 'Occasional Helper',
            GSL: 'Group Scout Leader',
            AGSL: 'Assistant Group Scout Leader',
            YL: 'Young Leader'
        };
        return(
            <div id="ViewLeader">
                <SubHeader heading="View leader">
                    <Link to="/leaders"><span className="nav-button">back</span></Link>
                    { !Cookies.parent_id ? <a><span className="nav-button" onClick={ this.deleteLeader.bind(this) }>Delete</span></a> : '' }
                </SubHeader>
                <PageContent>
                    <div className="spacer"></div>

                    <div className="view-sheet">
                        <div className="view-group">
                            <h3>Leader details</h3>
                            { !Cookies.parent_id ? <Link to={ "/leaders/"+this.props.params.id+"/edit" }><span className="nav-button">Edit</span></Link> : '' }

                            <div className="view-row">
                                <div className="field-group">
                                    <div className="field-name">Name:</div>
                                    <div className="field-value">{ this.state.forename + ' ' + this.state.surname }</div>
                                </div>
                                <div className="field-group">
                                    <div className="field-name">Position:</div>
                                    <div className="field-value">{ positions[this.state.position] }</div>
                                </div>
                            </div>

                            <div className="view-col">
                                <div className="field-group">
                                    <div className="field-name">Cub name:</div>
                                    <div className="field-value">{ this.state.cub_name || ' ' }</div>
                                </div>
                                <div className="field-group">
                                    <div className="field-name">Home Phone:</div>
                                    <div className="field-value">{ this.state.phone_1 }</div>
                                </div>
                                <div className="field-group">
                                    <div className="field-name">Mobile Phone:</div>
                                    <div className="field-value">{ this.state.phone_2 }</div>
                                </div>
                                <div className="field-group">
                                    <div className="field-name">Email address:</div>
                                    <div className="field-value">{ this.state.email }</div>
                                </div>
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

                        </div>

                    </div>
                </PageContent>
            </div>
        )
    }
}
