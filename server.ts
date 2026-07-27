import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { handleGenerateRequest } from "./api/generate";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request body parser
  app.use(express.json({ limit: "25mb" }));

  // API health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "GreenScan EcoFinder Server" });
  });

  // Handle platform/telemetry/Vercel/Sentry mock endpoints to prevent 404 & 429 console errors
  app.all(
    [
      "/api/v1/*",
      "/api/v6/*",
      "/api/projects/*",
      "/api/deployments/*",
      "/api/sentry/*",
      "/ingest/*",
      "/o205439.ingest.sentry.io/*",
    ],
    (_req, res) => {
      res.status(200).json({ status: "ok", mock: true });
    }
  );

  // Vercel serverless function equivalent route
  app.post("/api/generate", async (req, res) => {
    try {
      const result = await handleGenerateRequest(req.body);
      res.json(result);
    } catch (error: any) {
      console.error("API /api/generate error:", error);
      res.status(500).json({ error: error.message || "서버 처리 오류가 발생했습니다." });
    }
  });

  // Vite middleware for development vs static production serve
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EcoFinder server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
