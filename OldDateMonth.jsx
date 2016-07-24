var React = require("react");
var ReactDOM = require("react-dom");
var Button = require("./Button.jsx");

module.exports = React.createClass({
    isYearMonth: function () {
        return this.props.type === "month";
    },
    dayOfWeek: function dayOfWeek(dow) {
        return "日月火水木金土".charAt(dow);
    },
    render: function () {
        var year = this.props.date.getFullYear();
        var month = this.props.date.getMonth() + 1;
        var date  = this.props.date.getDate();
        var day   = this.props.date.getDay();
        var firstLine = this.isYearMonth() ? (
            <span className="current gotoCurrent" id="date">
                <span className="keyNumber">{year}</span>年
                <span className="keyNumber">{month}</span>月
            </span>
        ) : (
            <span className="current gotoCurrent" id="date">
                <span className="keyNumber">{month}</span>月
                <span className="keyNumber">{date}</span>日
                <span className={"dayOfWeek" + day}>({this.dayOfWeek(day)})</span>
            </span>
        );
        return (
            <div className="old-date-month">
                <h1>
                    <Button className="old-date-month__prev" title="&laquo;" onClick={this.props.onPrevClick}/>
                    {firstLine}
                    <Button className="old-date-month__next" title="&raquo;" onClick={this.props.onNextClick} />
                </h1>
                <p className="old"><span className="gotoCurrent">{this.props.subtitle}</span></p>
            </div>
        );
    }
});
