var React = require("react");

module.exports = React.createClass({
    handleClick: function (e) {
        this.props.onClick(e);
    },
    render: function () {
        var cls = this.props.className + " button";
        return (
            <a href="#"
               className={cls}
               onClick={this.handleClick}>
                {this.props.title}
            </a>
        );
    }
});
