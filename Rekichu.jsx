import React from "react";
import RekichuItem from "./RekichuItem.jsx";

export default class Rekichu extends React.Component {
    render() {
        var elts = [];
        var modifier = (this.props.type && this.props.type === 'toolbar') ? 'rekichu--toolbar' : '';
        for (var item of this.props.data) {
            elts.push(
                <RekichuItem name={item[0]}
                             value={item[1]}
                             onClick={this.props.onClick} />
            );
        }
        return (
            <div className={"rekichu " + modifier}>
                {elts}
            </div>
        );
    }
}
