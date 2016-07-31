var React = require("react");
var ReactDOM = require("react-dom");

module.exports = React.createClass({
    render: function () {
        var rows = this.props.items.map(function (aItem) {
            var title = aItem[0];
            if (!Array.isArray(title)) {
                title = [title, title];
            }
            var reading = aItem[1];
            var desc = aItem[2];
            var id = name + '_' + title[0];
            var titleHtml = (
                <span id={id}>{title[1]}</span>
            );
            if (reading) {
                titleHtml = (
                    <div>
                        <div className="ruby">{reading}</div>
                        {titleHtml}
                    </div>
                );
            }
            return (
                <tr><th>{titleHtml}</th><td>{desc}</td></tr>
            );
        });
        return (
            <table>
                {rows}
            </table>
        );
    }
});
