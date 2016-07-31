var React = require("react");
var ReactDOM = require("react-dom");
var Explanation = require("./Explanation.jsx");

module.exports = React.createClass({
    render: function () {
        var elts = [];
        this.props.data.forEach(function (aItem) {
            if (elts.length) {
                elts.push(<hr />);
            }
            elts.push(
                <Explanation name={aItem.name}
                    description={aItem.description}
                    items={aItem.items}
                    items2={aItem.items2}
                    cite={aItem.cite} />
            );
        });
        return (
            <div>
                {elts}
            </div>
        );
    },
});
