import React from "react";

export default class Rekichu extends React.Component {
    render() {
        var elts = [];
        var modifier = (this.props.type && this.props.type === 'toolbar') ? 'rekichu--toolbar' : '';
        for (var item of this.props.data) {
            var name = item[0];
            var value = item[1];
            elts.push(
                <a href={'#' + name} className="rekichu__item">
                    <div className="rekichu__title">{name}</div>
                    <div className="rekichu__content">{value}</div>
                </a>
            );
        }
        return (
            <div className={"rekichu " + modifier}>
                {elts}
            </div>
        );
    }
}
