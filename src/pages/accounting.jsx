import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const accounts = [
  "Cash",
  "AR",
  "Office Supplies",
  "Electrical Equipment",
  "Account Payable",
  "Capital",
  "Withdraws",
  "Revenue",
  "Expenses"
];

export default function AccountingApp() {
  const [day, setDay] = useState("a");
  const [inputs, setInputs] = useState({});
  const [rows, setRows] = useState([]);

  const handleChange = (account, value) => {
    setInputs({ ...inputs, [account]: value });
  };

  const handleAdd = () => {
    setRows([...rows, { day, ...inputs }]);
    setInputs({});
    setDay(String.fromCharCode(day.charCodeAt(0) + 1)); // a → b → c
  };

  const exportToExcel = () => {
    // LEFT TABLE: Accounts per day
    const leftHeader = ["Day", ...accounts];
    const leftData = rows.map((row) => [
      row.day,
      ...accounts.map((acc) => row[acc] || "")
    ]);

    // Totals
    const totals = ["Total", ...accounts.map((acc) =>
      rows.reduce((sum, row) => sum + (parseFloat(row[acc]) || 0), 0)
    )];
    leftData.push(totals);

    // RIGHT TABLE: Transaction log
    const rightHeader = ["Day", "Account", "Value"];
    const rightData = [];
    rows.forEach((row) => {
      accounts.forEach((acc) => {
        if (row[acc]) {
          rightData.push([row.day, acc, row[acc]]);
        }
      });
    });

    // Create workbook
    const wb = XLSX.utils.book_new();
    const wsLeft = XLSX.utils.aoa_to_sheet([leftHeader, ...leftData]);
    const wsRight = XLSX.utils.aoa_to_sheet([rightHeader, ...rightData]);

    XLSX.utils.book_append_sheet(wb, wsLeft, "Summary");
    XLSX.utils.book_append_sheet(wb, wsRight, "Transactions");

    // Export
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Accounting.xlsx");
  };

  return (
    <div>
      <h2>Daily Accounting Entry</h2>

      <div>
        <label>Day: </label>
        <input value={day} onChange={(e) => setDay(e.target.value)} />
      </div>

      {accounts.map((acc) => (
        <div key={acc}>
          <label>{acc}: </label>
          <input
            type="number"
            value={inputs[acc] || ""}
            onChange={(e) => handleChange(acc, e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleAdd}>Add Entry</button>
      <button onClick={exportToExcel} style={{ marginLeft: "10px" }}>
        Export Excel
      </button>

      <h3>Entries</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Day</th>
            {accounts.map((acc) => (
              <th key={acc}>{acc}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row.day}</td>
              {accounts.map((acc) => (
                <td key={acc}>{row[acc] || ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
