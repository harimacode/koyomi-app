import React from "react";

export default class RekichuItem extends React.Component {
    render() {
        return (
            <a href={'#' + this.props.name} className="rekichu__item">
                <div className="rekichu__title">{this.props.name}</div>
                <div className="rekichu__content">{this.props.value}</div>
            </a>
        );
    }
}
