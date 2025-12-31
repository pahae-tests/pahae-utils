import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { html } = req.body;
  if (!html) return res.status(400).json({ error: "HTML manquant" });

  try {
    const response = await fetch("https://api.pdfshift.io/v3/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PDFSHIFT_KEY}`
      },
      body: JSON.stringify({ source: html })
    });

    const pdfBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="rapport.pdf"');
    res.send(Buffer.from(pdfBuffer));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
