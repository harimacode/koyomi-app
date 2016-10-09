import React from "react";
import ReactDOM from "react-dom";
import Explanation from "./Explanation.jsx";

export default class Explanations extends React.Component {
    render() {
        var elts = [];
        this.props.data.forEach(function (aItem) {
            var index = elts.length;
            if (index) {
                elts.push(<hr key={"separator" + index} className="explanations__separator" />);
            }
            elts.push(
                <Explanation key={"explanation" + index}
                             name={aItem.name}
                             description={aItem.description}
                             items={aItem.items}
                             items2={aItem.items2}
                             cite={aItem.cite} />
            );
        });
        return (
            <div className="explanations">
                {elts}
            </div>
        );
    }
}
