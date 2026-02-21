import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseUrl = "https://www.collegesecracy.com";

// ✅ Only public routes
const publicRoutes = [
  "/", 
  "/login", 
  "/signup", 
  "/about", 
  "/contact", 
  "/terms", 
  "/privacy", 
  "/cookies", 
  "/refund", 
  "/verify-email", 
  "/reset-password", 
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${publicRoutes
    .map(
      (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
  </url>`
    )
    .join("")}
</urlset>`;

const filePath = join(__dirname, "../public/sitemap.xml");
fs.writeFileSync(filePath, sitemap);
console.log("✅ Sitemap generated at:", filePath);
