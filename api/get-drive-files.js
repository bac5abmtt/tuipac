const https = require('https');

module.exports = async (req, res) => {
  // Vercel lấy tham số qua req.query
  const id = req.query.id;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  if (!id) {
    return res.status(400).json({ error: "Thiếu Folder ID" });
  }
  if (!apiKey) {
    return res.status(500).json({ error: "Chưa cấu hình GOOGLE_DRIVE_API_KEY trên Vercel" });
  }

  const url = `https://googleapis.com{id}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name)&orderBy=name&key=${apiKey}`;

  // Cho phép mọi nguồn gọi đến API này (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  return new Promise((resolve) => {
    https.get(url, (googleRes) => {
      let data = '';
      googleRes.on('data', (chunk) => { data += chunk; });
      googleRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            res.status(googleRes.statusCode || 400).json({ error: parsed.error.message });
          } else {
            res.status(200).send(data);
          }
          resolve();
        } catch (e) {
          res.status(500).json({ error: "Lỗi xử lý dữ liệu JSON" });
          resolve();
        }
      });
    }).on('error', (err) => {
      res.status(500).json({ error: err.message });
      resolve();
    });
  });
};
