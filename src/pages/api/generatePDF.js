export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const response = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.PDFSHIFT_KEY
    },
    body: JSON.stringify({
      source: req.body.html,
      format: "A4",
      use_print: false
    })
  });

  if (!response.ok) {
    const error = await response.text();
    return res.status(500).json({ error });
  }

  const buffer = await response.arrayBuffer();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=rapport.pdf"
  );

  res.send(Buffer.from(buffer));
}
