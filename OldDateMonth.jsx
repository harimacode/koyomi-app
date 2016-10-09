import React from "react";
import ReactDOM from "react-dom";
import Button from "./Button.jsx";

export default class OldDateMonth extends React.Component {
    isYearMonth() {
        return this.props.type === "month";
    }
    dayOfWeek(dow) {
        return "日月火水木金土".charAt(dow);
    }
    render() {
        var year = this.props.date.getFullYear();
        var month = this.props.date.getMonth() + 1;
        var date  = this.props.date.getDate();
        var day   = this.props.date.getDay();
        var firstLine = this.isYearMonth() ? (
            <span className="old-date-month__current" id="date" onClick={this.props.onCurrentClick}>
                <span className="old-date-month__keyNumber">{year}</span>年
                <span className="old-date-month__keyNumber">{month}</span>月
            </span>
        ) : (
            <span className="old-date-month__current" id="date" onClick={this.props.onCurrentClick}>
                <span className="old-date-month__keyNumber">{month}</span>月
                <span className="old-date-month__keyNumber">{date}</span>日
                <span className={"old-date-month--dayOfWeek" + day}>({this.dayOfWeek(day)})</span>
            </span>
        );
        return (
            <div className="old-date-month">
                <div className="old-date-month__caption">
                    <Button className="old-date-month__prev" title="&laquo;" onClick={this.props.onPrevClick}/>
                    {firstLine}
                    <Button className="old-date-month__next" title="&raquo;" onClick={this.props.onNextClick} />
                </div>
                <p className="old-date-month__old"><span onClick={this.props.onCurrentClick}>{this.props.subtitle}</span></p>
            </div>
        );
    }
}
