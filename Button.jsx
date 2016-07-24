var React = require("react");

module.exports = React.createClass({
    handleClick: function (e) {
        this.props.onClick(e);
    },
    render: function () {
        return (
            <a href="#"
               className="button"
               onClick={this.handleClick}>
                {this.props.title}
            </a>
        );
    }
});
