import { useEffect, useState } from "react";

function Total() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("spending-data");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // Group by month and year
  const monthlyTotals = {};
  const yearlyTotals = {};

  items.forEach((i) => {
    const d = new Date(i.date);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const yearKey = d.getFullYear();

    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + i.price;
    yearlyTotals[yearKey] = (yearlyTotals[yearKey] || 0) + i.price;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Totals</h1>

      <h2>Monthly Totals</h2>
      <ul>
        {Object.entries(monthlyTotals).map(([month, total]) => (
          <li key={month}>
            {month}: ${total}
          </li>
        ))}
      </ul>

      <h2>Yearly Totals</h2>
      <ul>
        {Object.entries(yearlyTotals).map(([year, total]) => (
          <li key={year}>
            {year}: ${total}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Total;
