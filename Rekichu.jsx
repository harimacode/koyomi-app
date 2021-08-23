import React from "react";
import RekichuItem from "./RekichuItem.jsx";
var common = require("./common.js");

export default class Rekichu extends React.Component {
    constructor() {
        super();
        this.handleScroll = this.handleScroll.bind(this);
    }
    handleScroll(e) {
        var tb = document.querySelector(".rekichu__toolbar");
        var gridBottom = document.querySelector(".rekichu__grid").getBoundingClientRect().bottom;
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
                <RekichuItem key={item[0]}
                             name={item[0]}
                             value={item[1]}
                             onClick={this.props.onClick} />
            );
        }
        return (
            <div className="rekichu">
                <div className="rekichu__toolbar">
                    {elts}
                </div>
                <div className="rekichu__grid">
                    {elts}
                </div>
            </div>
        );
    }
}
