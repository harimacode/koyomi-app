import React from "react";

export default class Button extends React.Component {
    handleClick(e) {
        this.props.onClick(e);
    }
    render() {
        var cls = this.props.className + " button";
        return (
            <a href="#"
               className={cls}
               onClick={this.handleClick.bind(this)}>
                {this.props.title}
            </a>
        );
    }
}
