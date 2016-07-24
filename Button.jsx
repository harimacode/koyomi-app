var React = require("react");

module.exports = React.createClass({
    handleClick: function () {
        this.props.onClick();
    },
    render: function () {
        return (
            <a href="#"
               className="button__navi button__link"
               onClick={this.handleClick}>
                {this.props.title}
            </a>
        );
    }
});
