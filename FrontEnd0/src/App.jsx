import { useEffect, useState } from "react";

function App() {
  const [goldData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [btmcPrice, setBtmcPrice] = useState(0);

  const serverUrl = "http://127.0.0.1:3001/";

  useEffect(() => {
    fetchAllData();
  }, []);

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
