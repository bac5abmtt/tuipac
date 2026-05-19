module.exports = async (req, res) => {
  // Thiết lập các Header CORS chống chặn trình duyệt
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Xử lý dữ liệu request OPTIONS preflight từ trình duyệt
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Lấy các tham số chuẩn theo kiến trúc Vercel CommonJS
  const id = req.query.id;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!id) {
    return res.status(400).json({ error: "Thiếu Folder ID" });
  }
  if (!apiKey) {
    return res.status(500).json({ error: "Chưa cấu hình GOOGLE_DRIVE_API_KEY trên Vercel" });
  }

  // Mã hóa chuỗi truy vấn an toàn bằng hàm có sẵn của JavaScript
  const qStr = encodeURIComponent("'" + id + "' in parents and mimeType contains 'image/'");
  const url = "https://googleapis.com" + qStr + "&fields=files(id,name)&orderBy=name&key=" + apiKey;

  try {
    const googleRes = await fetch(url);
    const data = await googleRes.json();

    if (data.error) {
      return res.status(googleRes.status || 400).json({ error: data.error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Lỗi kết nối mạng đến Google API" });
  }
};
