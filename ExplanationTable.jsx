import React from "react";
import ReactDOM from "react-dom";

export default class ExplanationTable extends React.Component {
    render() {
        var name = this.props.name;
        var mark = null;
        for (var item of this.props.marks) {
            if (item[0] === name) {
                var matcher = this.props.matcher ? this.props.matcher : (s) => s;
                mark = matcher(item[1]);
            }
        }
        var rows = [];
        for (var item of this.props.items) {
            var title = item[0];
            if (!Array.isArray(title)) {
                title = [title, title];
            }
            var cls = '';
            if (title[0] === mark) {
                cls += 'marked';
            }
            var reading = item[1];
            var descs = item[2];
            if (!Array.isArray(descs)) {
                descs = [descs];
            }
            var id = name + '_' + title[0];
            var titleHtml = (
                <span className={cls} id={id}>{title[1]}</span>
            );
            if (reading) {
                titleHtml = (
                    <div>
                        <div className="explanation-table__title-ruby">{reading}</div>
                        {titleHtml}
                    </div>
                );
            }
            var count = descs.length;
            var desc = descs.shift();
            rows.push(
                <tr key={id+count}>
                    <th className="explanation-table__title-cell" rowSpan={count}>{titleHtml}</th>
                    <td className="explanation-table__text-cell">{desc}</td>
                </tr>
            );
            for (var desc of descs) {
                rows.push(
                    <tr key={id+descs.length}>
                        <td className="explanation-table__text-cell">{desc}</td>
                    </tr>
                );
            }
        }
        return (
            <table className="explanation-table">
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}
