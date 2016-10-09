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
        var rows = this.props.items.map(function (aItem) {
            var title = aItem[0];
            if (!Array.isArray(title)) {
                title = [title, title];
            }
            var cls = '';
            if (title[0] === mark) {
                cls += 'marked';
            }
            var reading = aItem[1];
            var desc = aItem[2];
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
            return (
                <tr key={id}>
                    <th className="explanation-table__title-cell">{titleHtml}</th>
                    <td className="explanation-table__text-cell">{desc}</td>
                </tr>
            );
        });
        return (
            <table className="explanation-table">
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}
