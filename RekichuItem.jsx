import React from "react";

export default class RekichuItem extends React.Component {
    handleClick(e) {
        this.props.onClick(e, this.props.name);
    }
    render() {
        return (
            <div className="rekichu__item" onClick={this.handleClick.bind(this)}>
                <div className="rekichu__title">{this.props.name}</div>
                <div className="rekichu__content">{this.props.value}</div>
            </div>
        );
    }
}
