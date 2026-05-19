export default async function handler(req, res) {
  // Cấu hình các Header CORS chống chặn trình duyệt
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Xử lý request kiểm tra (preflight) từ trình duyệt
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Tách tham số từ URL bằng cấu trúc chuẩn của Vercel
  const { id } = req.query;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!id) {
    return res.status(400).json({ error: "Thiếu Folder ID" });
  }
  if (!apiKey) {
    return res.status(500).json({ error: "Chưa cấu hình GOOGLE_DRIVE_API_KEY trên Vercel" });
  }

  // Khởi tạo chuỗi truy vấn và nối chuỗi bằng toán tử cộng (+) an toàn tuyệt đối
  const qStr = encodeURIComponent("'" + id + "' in parents and mimeType contains 'image/'");
  const url = "https://googleapis.com" + qStr + "&fields=files(id,name)&orderBy=name&key=" + apiKey;

  try {
    const googleRes = await fetch(url);
    const data = await googleRes.json();

    // Nếu Google phản hồi có lỗi cụ thể (quyền truy cập, sai key)
    if (data.error) {
      return res.status(googleRes.status || 400).json({ error: data.error.message });
    }

    // Trả về dữ liệu sạch cho Frontend
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Lỗi kết nối hoặc xử lý từ mạng Google" });
  }
}
