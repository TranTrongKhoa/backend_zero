import { useEffect, useRef, useState } from "react";

function DialogForm({ open, onClose, onSubmit }) {
  const [field1, setField1] = useState(0.0);
  const [field2, setField2] = useState(0);
  const [error, setError] = useState("");
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      firstInputRef.current?.focus();
      const onKeyDown = (e) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [open, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault(); // ngăn reload trang
    if (!field1.trim() || !field2.trim()) {
      setError("Vui lòng nhập đủ 2 ô.");
      return;
    }
    onSubmit({ field1, field2 });
    // reset & đóng
    setField1(0.0);
    setField2(0);
    setError("");
    onClose();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Form nhập thông tin"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 10,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Nhập thông tin mua vàng</h3>

        <label style={{ display: "block", marginBottom: 8 }}>
          Số lượng
          <input
            ref={firstInputRef}
            value={field1}
            onChange={(e) => setField1(e.target.value)}
            placeholder="Nhập giá trị 1"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Giá bán
          <input
            value={field2}
            onChange={(e) => setField2(e.target.value)}
            placeholder="Nhập giá trị 2"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>

        {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose}>Hủy</button>
          <button type="submit">OK</button>
        </div>
      </form>
    </div>
  );
}

function App() {
  const [goldData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [btmcPrice, setBtmcPrice] = useState(0);
  const [open, setOpen] = useState(false);

  const serverUrl = "http://127.0.0.1:3001/";

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSubmit = ({ field1, field2 }) => {
    console.log("Submitted:", field1, field2);
    setLoading(true);
    addGold(field1, field2)
      .then(() => {
        fetchAllData();
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const fetchGold = async () => {
    const response = await fetch(`${serverUrl}gold`);
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu từ server");
    }
    const result = await response.json();

    // Convert dữ liệu nếu cần
    const converted = result.data.map((item, index) => ({
      id: index + 1,
      count: parseFloat(item.count),
      purchasePrice: item.purchasePrice,
    }));
    return converted;
  };

  const addGold = async (count, purchasePrice) => {
    try {
      const response = await fetch(`${serverUrl}addGold`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count: parseFloat(count),
          purchasePrice: parseInt(purchasePrice, 10),
        }),
      });

      if (!response.ok) {
        throw new Error("Gửi dữ liệu thất bại");
      }

      const result = await response.json();
      return result; // object trả về từ server
    } catch (error) {
      console.error("Lỗi khi gọi API addGold:", error);
      throw error;
    }
  };


  const fetchBtmc = async () => {
    const response = await fetch(`${serverUrl}fetchBtmc`);
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu từ server");
    }
    const result = await response.json();
    // Convert dữ liệu nếu cần
    const converted = result.buy * 1000;
    return converted;
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [goldData, btmcPrice] = await Promise.all([
        fetchGold(),
        fetchBtmc(),
      ]);

      setData(goldData);
      setBtmcPrice(btmcPrice);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>⏳ Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={fetchAllData}>🔄 Làm mới dữ liệu</button>

      <h2>Giá mua : {btmcPrice.toLocaleString("vi-VN")} VND</h2>
      <h2>Giá bán : {(btmcPrice + 300000).toLocaleString("vi-VN")} VND</h2>

      <h2>Chi Tiết</h2>

      <button onClick={() => setOpen(true)}>Thêm ➕</button>

      <DialogForm open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>STT</th>
            <th>Số Lượng</th>
            <th>Giá Mua (1 chỉ)</th>
            <th>Tiền Mua</th>
            <th>Tiền Bán</th>
            <th>Chênh Lệch</th>
          </tr>
        </thead>
        <tbody>
          {goldData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.count}</td>
              <td>{item.purchasePrice.toLocaleString("vi-VN")}</td>
              <td>{(item.count * item.purchasePrice).toLocaleString("vi-VN")}</td>
              <td>{(item.count * btmcPrice).toLocaleString("vi-VN")}</td>
              <td>
                {(
                  item.count * (btmcPrice - item.purchasePrice)
                ).toLocaleString("vi-VN")}
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th>Tổng Cộng</th>
            <td>{goldData.reduce((sum, item) => sum + item.count, 0)}</td>
            <td></td>
            <td>{goldData.reduce((sum, item) => sum + item.count * item.purchasePrice, 0).toLocaleString("vi-VN")}</td>
            <td>{goldData.reduce((sum, item) => sum + item.count * btmcPrice, 0).toLocaleString("vi-VN")}</td>
            <td>{goldData.reduce((sum, item) => sum + item.count * (btmcPrice - item.purchasePrice), 0).toLocaleString("vi-VN")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
