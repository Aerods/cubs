import React from 'react';
import { browserHistory } from 'react-router';
import Modal from '../widgets/Modal';
import ParentForm from '../pages/ParentForm';
import DataTable from '../widgets/DataTable';

var AddCubParent = React.createClass({
    getDefaultProps: function() {
        return {
            parents: [],
            cub: {},
            addParent: null,
            closeModal: null
        }
    },

    getInitialState: function() {
        return {
            isFormOpen: false
        }
    },

    handleClick: function(id) {
        this.props.onClick(id);
    },

    openForm: function(id) {
        this.setState({ isFormOpen: true });
    },

    closeForm: function() {
        this.setState({ isFormOpen: false });
    },

    clickParent: function(parent) {
        parent.cub_id = null;
        this.props.addParent(parent);
    },

    render: function() {
        var cubName;
        if (this.props.cub.forename) cubName = this.props.cub.forename + ' ' + this.props.cub.surname;
        var heading = cubName ? (<h4>Add parent of { cubName }</h4>) : (<h4>Add parent</h4>);
        var tableHeaders = {
            title: 'Title',
            forename: 'First name',
            surname: 'Last name'
        };
        return(
            <div id="AddCubParent" className="row">
                { heading }
                <div className="spacer hidden-xs" />
                <Modal isOpen={this.state.isFormOpen}>
                    <ParentForm onClose={ this.closeForm } onSave={ this.props.addParent } cub={ this.props.cub } params={ {} } />
                </Modal>

                <DataTable
                    headers={ tableHeaders }
                    classes={ {title: 'hidden-xs'} }
                    data={ this.props.parents }
                    onClick={ this.clickParent }
                    height="short" />

                <div className="spacer" />
                <a><span className="nav-button" onClick={ this.props.closeModal }>cancel</span></a>
                <a><span className="nav-button" onClick={ this.openForm }>new</span></a>
           </div>
       )
   }
});

export default AddCubParent;
