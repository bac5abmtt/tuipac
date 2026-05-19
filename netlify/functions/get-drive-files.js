export const handler = async (event) => {
    // Lấy các tham số (query) từ frontend gửi lên (nếu có)
    const folderId = event.queryStringParameters.folderId || '1GxV_tVPWliZcMsrBnH2m5ILYTcYTTrIq';

    // Lấy API Key từ biến môi trường được giấu trên Server Netlify
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

    const url = `https://googleapis.com{folderId}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name)&orderBy=name&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Lỗi kết nối Google API" }),
        };
    }
};
