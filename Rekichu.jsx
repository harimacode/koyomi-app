import React from "react";
import RekichuItem from "./RekichuItem.jsx";

export default class Rekichu extends React.Component {
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
                <div>
                    {elts}
                </div>
            </div>
        );
    }
}
