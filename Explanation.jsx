import React from "react";
import ReactDOM from "react-dom";
import ExplanationTable from "./ExplanationTable.jsx";

export default class Explanation extends React.Component {
    render() {
        var name = this.props.name;
        var items2 = this.props.items2 ? (
            <ExplanationTable name={name}
                                items={this.props.items2}
                                matcher={this.props.matcherForItems2}
                                marks={this.props.marks} />
        ) : null;
        var cite = this.props.cite ? (
            <p><cite dangerouslySetInnerHTML={{__html: this.props.cite}} /></p>
        ) : null;
        return (
            <div>
                <h2 className="explanation__title" id={name}>{name}</h2>
                <p className="explanation__description"
                   dangerouslySetInnerHTML={{__html: this.props.description}} />
                <ExplanationTable name={name}
                                  items={this.props.items}
                                  matcher={this.props.matcherForItems}
                                  marks={this.props.marks} />
                {items2}
                {cite}
            </div>
        );
    }
}
