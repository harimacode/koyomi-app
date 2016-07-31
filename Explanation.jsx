var React = require("react");
var ReactDOM = require("react-dom");
var ExplanationTable = require("./ExplanationTable.jsx");

module.exports = React.createClass({
    render: function () {
        var name = this.props.name;
        var tables = [this.props.items];
        if (this.props.items2) {
            tables.push(this.props.items2);
        }
        var cite = this.props.cite ? (
            <p><cite dangerouslySetInnerHTML={{__html: this.props.cite}} /></p>
        ) : null;
        return (
            <div>
               <h2 className="explanation__title" id={name}>{name}</h2>
               <p className="explanation__description"
                  dangerouslySetInnerHTML={{__html: this.props.description}} />
               {tables.map(function (aTable) {
                   return <ExplanationTable items={aTable} />;
               })}
               {cite}
            </div>
        );
    },
});
