import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Total from "./Total";


function formatDate(dateString) {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function Spending() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem("spending-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setItems(parsed);
      if (parsed.length > 0) {
        setSelectedDate(parsed[parsed.length - 1].date); // latest date
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("spending-data", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!itemName || !price) return;

    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
    const newEntry = {
      id: Date.now().toString(),
      name: itemName,
      price: parseFloat(price),
      date: today,
    };

    const updated = [...items, newEntry];
    setItems(updated);
    setItemName("");
    setPrice("");
    setSelectedDate(today); // auto-switch to today's list
  };

  // Unique dates (latest first)
  const uniqueDates = [...new Set(items.map((i) => i.date))].sort((a, b) => (a < b ? 1 : -1));
  const filteredItems = items.filter((i) => i.date === selectedDate);
  const dailyTotal = filteredItems.reduce((sum, i) => sum + i.price, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛒 Spending</h1>

      {/* Form */}
      <input
        type="text"
        placeholder="Item"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        padding="10px"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        
        
      />
      <button onClick={addItem} style={{ marginLeft: "10px" }}>Add</button>

      {/* Date filter */}
      {uniqueDates.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <label>Select Date: </label>
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            {uniqueDates.map((d) => (
              <option key={d} value={d}>
                {formatDate(d)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Daily Total */}
      <h3 style={{ marginTop: "15px" }}>Total for {formatDate(selectedDate)}: ${dailyTotal}</h3>
      <Router>
        <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
          <Link to="/total">Total</Link>
        </nav>
        <Routes>          
          <Route path="/total" element={<Total />} />
        </Routes>
      </Router>

      {/* Table */}
      <table style={{ marginTop: "10px", width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Item</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              
              <td>{item.name}</td>
              <td style={{ textAlign: "right" }}>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Spending;
