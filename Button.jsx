var React = require("react");

module.exports = React.createClass({
    render: function () {
        return (
            <a href="#" className="button__navi button__link">{this.props.title}</a>
        );
    }
});
