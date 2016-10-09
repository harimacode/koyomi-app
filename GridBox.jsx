import React from "react";

export default class GridBox extends React.Component {
    render() {
        var elts = [];
        for (var item of this.props.data) {
            var name = item[0];
            var className = item[1];
            elts.push(
                <a href={'#' + name} className="box"><div className="title">{name}</div><div className={className}></div></a>
            );
        }
        return (
            <div className="gridbox">
                {elts}
            </div>
        );
    }
}
