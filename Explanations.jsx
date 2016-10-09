import React from "react";
import ReactDOM from "react-dom";
import Explanation from "./Explanation.jsx";

export default class Explanations extends React.Component {
    render() {
        var elts = [];
        for (var item of this.props.data) {
            var index = elts.length;
            if (index) {
                elts.push(<hr key={"separator" + index} className="explanations__separator" />);
            }
            elts.push(
                <Explanation key={"explanation" + index}
                             name={item.name}
                             description={item.description}
                             items={item.items}
                             items2={item.items2}
                             cite={item.cite} />
            );
        }
        return (
            <div className="explanations">
                {elts}
            </div>
        );
    }
}
