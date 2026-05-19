const https = require('https');

exports.handler = async (event) => {
  const id = event.queryStringParameters.id;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  console.log("=== KIỂM TRA BACKEND ===");
  console.log("Folder ID:", id);
  console.log("Có API Key chưa?:", apiKey ? "CÓ" : "KHÔNG");

  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ error: "Thiếu Folder ID" }) };
  }
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Chưa cấu hình GOOGLE_DRIVE_API_KEY trên Netlify" }) };
  }

  const url = `https://googleapis.com{id}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name)&orderBy=name&key=${apiKey}`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            console.error("Lỗi Google API:", parsed.error.message);
            resolve({
              statusCode: res.statusCode || 400,
              body: JSON.stringify({ error: parsed.error.message })
            });
          } else {
            resolve({
              statusCode: 200,
              headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
              },
              body: data
            });
          }
        } catch (e) {
          console.error("Lỗi cú pháp JSON:", e.message);
          resolve({ statusCode: 500, body: JSON.stringify({ error: "Lỗi xử lý dữ liệu" }) });
        }
      });
    }).on('error', (err) => {
      console.error("Lỗi kết nối mạng:", err.message);
      resolve({ statusCode: 500, body: JSON.stringify({ error: err.message }) });
    });
  });
};
