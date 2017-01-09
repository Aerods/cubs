import React from 'react';
import Cookies from '../cookies.js';
var moment = require('moment');
var OnResize = require("react-window-mixins").OnResize;

var DataTable = React.createClass({
    mixins: [ OnResize ],

    getDefaultProps: function() {
        return {
            headers: {},
            classes: {},
            data: [],
            height: null,
            search: true,
            onClick: null
        }
    },

    getInitialState: function() {
        return {
            sortBy: null,
            sortAscending: 1,
            search: '',
        }
    },

    handleSearch: function(e) {
      this.setState({ search: e.target.value });
    },

    render: function() {
        var self = this;
        var headers = Object.keys(self.props.headers).map(function(header, key) {
            function clickHeader() {
                var sortAscending = self.state.sortAscending;
                if (self.state.sortBy == header) sortAscending = !sortAscending;
                self.setState({
                    sortBy: header,
                    sortAscending: sortAscending
                });
            }
            var sortIcon;
            if (self.state.sortBy == header) {
                sortIcon = self.state.sortAscending ? (<i className="fa fa-sort-asc fa-lg"></i>) : (<i className="fa fa-sort-desc fa-lg"></i>);
            }
            var width = (header == 'image' ? 75 : 100);
            return (
                <th key={ key } width={ width } onClick={ clickHeader } className={self.props.classes[header] } >
                    { self.props.headers[header] }{ sortIcon }
                </th>
            );
         });

        var data = self.props.data;
        var sortBy = self.state.sortBy;
        function compare(a, b) {
            // 11111 Hack for empty data
            var a = a[sortBy] || '11111';
            var b = b[sortBy] || '11111';

            // Sort any dates
            var aAsDate = moment(a, 'DD/MM/YYYY').format('YYYY-MM-DD');
            var bAsDate = moment(b, 'DD/MM/YYYY').format('YYYY-MM-DD');
            a = (aAsDate == 'Invalid date' ? a : aAsDate);
            b = (bAsDate == 'Invalid date' ? b : bAsDate);

            if (self.state.sortAscending) {
                if (a < b) return -1;
                if (a > b) return 1;
            } else {
                if (a < b) return 1;
                if (a > b) return -1;
            }
            return 0;
        }
        if (this.state.sortBy) data.sort(compare);

        data = data.map(function(row, key) {
            function clickRow() {
                if (self.props.onClick) self.props.onClick(row);
            }

            // Search functionality
            var searchTerm = self.state.search.trim().toLowerCase();
            var searchTerms = searchTerm.split(' ');
            var includeRowInSearch = self.props.search && self.state.search ? 0 : 1;
            var matches = searchTerms.map(function(term) {
                var rowMatches = Object.keys(self.props.headers).map(function(value, key) {
                    if (row[value] && row[value].toString().toLowerCase().indexOf(term) >= 0) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                return rowMatches.indexOf(1) > -1 ? 1 : 0;
            });

            var values = Object.keys(self.props.headers).map(function(value, key) {
                var className = self.props.classes[value] + ' ';
                var width = 100;
                var sixes = ['Red', 'Blue', 'Yellow', 'Green'];
                if (sixes.indexOf(row[value]) != -1) className += row[value].toLowerCase();
                var val;
                if (value == 'image') {
                    val = (<img src={ Cookies.host+'/images/badges/'+row[value] } width="60" />);
                    width = 60;
                    className += ' image';
                } else {
                    var valueString = row[value];
                    if (valueString) {
                        if (typeof valueString == 'string') {
                            var buffer = new Buffer( valueString );
                            valueString = buffer.toString('utf8');
                        }
                    } else {
                        valueString = '-';
                    }
                    val = valueString;
                }
                return (<td key={ key } className={ className } width={ width }>{ val }</td>);
            })
            var rowClass;
            if (row.selected) rowClass = 'selected';
            if (row.awarded) rowClass = 'awarded';
            if (matches.indexOf(0) == -1 || !self.props.search || !self.state.search) return (
                <tr key={ key } onClick={ clickRow } className={ rowClass }>
                    { values }
                </tr>
            );
        });

        if (this.props.height) {
            var tableHeight = (this.props.height == 'short' ? 218 : self.state.window.height-187);
            if (self.state.window.width < 520) tableHeight += 25;
            return(
                <div className="table-widget">
                    <div className="row">
                        { this.props.search ? <input type="text" className="search-input" name="search" placeholder="search" value={ this.state.search } onChange={ this.handleSearch } /> : '' }
                        <table className="header">
                            <thead>
                                <tr>{ headers }</tr>
                            </thead>
                        </table>
                        <div className="table-scroll-container" style={ {height: tableHeight} }>
                            <table className="scrollable">
                                <tbody>
                                    { data }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
           )
       } else {
            return(
                <div className="table-widget">
                    <div className="row">
                        { this.props.search ? <input type="text" className="search-input" name="search" placeholder="search" value={ this.state.search } onChange={ this.handleSearch } /> : '' }
                        <table>
                            <thead>
                                <tr>{ headers }</tr>
                            </thead>
                            <tbody>
                                { data }
                            </tbody>
                        </table>
                    </div>
                </div>
           )
       }
   }
});

export default DataTable;
