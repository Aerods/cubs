import React from 'react';

var BadgeGrid = React.createClass({
    getDefaultProps: function() {
      return {
          badges: [],
          onClick: null,
          search: false,
          showProgress: false
      }
    },
    getInitialState: function() {
        return {
            search: '',
        }
    },

    handleSearch: function(e) {
      this.setState({ search: e.target.value });
    },

    render: function() {
        var self = this;
        var badges = self.props.badges;

        // Ensure badges appear in the correct order
        function compare(a, b) {
            if (a.ordering < b.ordering) return -1;
            if (a.ordering > b.ordering) return 1;
            return 0;
        }
        badges.sort(compare);

        var badgeGrid = badges.map(function(badge, key) {
            // Search functionality
            var searchTerm = self.state.search.trim().toLowerCase();
            var searchTerms = searchTerm.split(' ');
            var includeRowInSearch = self.props.search && self.state.search ? 0 : 1;
            var matches = searchTerms.map(function(term) {
                var rowMatches = Object.keys(badge).map(function(value, key) {
                    if (badge[value] && badge[value].toString().toLowerCase().indexOf(term) >= 0) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                return rowMatches.indexOf(1) > -1 ? 1 : 0;
            });

            function clickBadge() {
                if (self.props.onClick) self.props.onClick(badge);
            }
            var imageClass = 'badge-image';
            if (badge.name == 'Moving on Award') imageClass += ' moving-on'; // Annoying special case...
            var notEarned = (self.props.showProgress && badge.progress<100);
            if (notEarned) imageClass += ' not-earned'; // Annoying special case...
            if (matches.indexOf(0) == -1 || !self.props.search || !self.state.search) return (
                <div key={ key } className="badge-grid-item" onClick={ clickBadge }>
                    <div className={ imageClass }><img src={ "http://localhost:8080/images/badges/"+badge.image } /></div>
                    <div className="badge-name">{ badge.name + (badge.type == 'Staged' ? ' ' + badge.stage : '') }</div>
                    { notEarned ? <span className="percentage">{ badge.progress + '%' }</span> : '' }
                </div>);
        });
        return (
            <div id="BadgeGrid">
                <div className="row">
                    { this.props.search ?
                            <input type="text" className="search-input" name="search" placeholder="search" value={ this.state.search } onChange={ this.handleSearch } />
                    : '' }
                    <div className="badge-grid-wrapper">
                        <div className="badge-grid">{ badgeGrid }</div>
                    </div>
                </div>
            </div>
        )
    }
});

export default BadgeGrid;
