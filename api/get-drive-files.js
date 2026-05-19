module.exports = async (req, res) => {
  const id = req.query.id;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  // Cho phép mọi nguồn gọi đến API này (CORS) để tránh lỗi chặn trình duyệt
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');

  if (!id) {
    return res.status(400).json({ error: "Thiếu Folder ID" });
  }
  if (!apiKey) {
    return res.status(500).json({ error: "Chưa cấu hình GOOGLE_DRIVE_API_KEY trên Vercel" });
  }

  const url = `https://googleapis.com{id}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name)&orderBy=name&key=${apiKey}`;

  try {
    const googleRes = await fetch(url);
    const data = await googleRes.json();

    if (data.error) {
      return res.status(googleRes.status || 400).json({ error: data.error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Lỗi kết nối đến Google API" });
  }
};
