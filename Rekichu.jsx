import React from "react";
import RekichuItem from "./RekichuItem.jsx";
var common = require("./common.js");

export default class Rekichu extends React.Component {
    constructor() {
        super();
        this.handleScroll = this.handleScroll.bind(this);
    }
    handleScroll(e) {
        var tb = document.querySelector(".rekichu--toolbar");
        var gridBottom = document.querySelector(".rekichu--grid").getBoundingClientRect().bottom;
        common.removeClass(tb, "rekichu--visible");
        if (gridBottom < 0) {
            common.addClass(tb, "rekichu--visible");
        }
    }
    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll, false);
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll, false);
    }
    render() {
        var elts = [];
        for (var item of this.props.data) {
            elts.push(
                <RekichuItem name={item[0]}
                             value={item[1]}
                             onClick={this.props.onClick} />
            );
        }
        return (
            <div className="rekichu">
                <div className="rekichu--toolbar">
                    {elts}
                </div>
                <div className="rekichu--grid">
                    {elts}
                </div>
            </div>
        );
    }
}
