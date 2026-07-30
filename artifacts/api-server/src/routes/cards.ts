import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const router: IRouter = Router();

// Store cards in a ./data directory next to the built server
const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function cardPath(id: string) {
  // Sanitize: only allow UUID-like strings
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error("Invalid id");
  return path.join(DATA_DIR, `${id}.json`);
}

/** POST /api/cards — save card + photos, return { id } */
router.post("/cards", async (req, res) => {
  try {
    await ensureDataDir();
    const { d, p } = req.body;
    if (!d || !p) {
      res.status(400).json({ error: "Missing d or p fields" });
      return;
    }
    const id = randomUUID();
    const record = { id, d, p, createdAt: Date.now() };
    await fs.writeFile(cardPath(id), JSON.stringify(record), "utf8");
    res.json({ id });
  } catch (err) {
    console.error("POST /api/cards error", err);
    res.status(500).json({ error: "Failed to save card" });
  }
});

/** GET /api/cards/:id — retrieve card */
router.get("/cards/:id", async (req, res) => {
  try {
    const file = cardPath(req.params.id);
    const raw = await fs.readFile(file, "utf8");
    const record = JSON.parse(raw);
    res.json({ d: record.d, p: record.p });
  } catch (err: any) {
    if (err.code === "ENOENT") {
      res.status(404).json({ error: "Card not found" });
    } else {
      console.error("GET /api/cards/:id error", err);
      res.status(500).json({ error: "Failed to read card" });
    }
  }
});

export default router;
