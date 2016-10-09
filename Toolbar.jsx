import React from "react";

export default class Toolbar extends React.Component {
    render() {
        var elts = [];
        for (var item of this.props.data) {
            var name = item[0];
            var value = item[1];
            elts.push(
                <a href={'#' + name} className="box">
                    <div className="title">{name}</div>
                    <div className="toolbar__content">{value}</div>
                </a>
            );
        }
        return (
            <div className="toolbar">
                {elts}
            </div>
        );
    }
}
