import http from "node:http";

const port = Number(process.env.PETFIT_API_PORT || 8787);
const arkApiKey = process.env.ARK_API_KEY;
const arkModel = process.env.ARK_MODEL || "doubao-seed-2-0-lite-260428";
const arkBaseUrl =
  process.env.ARK_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3";

const json = (res, status, body) => {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Content-Length": Buffer.byteLength(data),
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(data);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 8_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });

const normalizeCandidates = (payload, catalogByKey) => {
  const rawCandidates = Array.isArray(payload?.candidates) ? payload.candidates : [];
  const seen = new Set();

  return rawCandidates
    .map((candidate) => {
      const recognitionKey = String(candidate?.recognitionKey || candidate?.key || "");
      const catalogEntry = catalogByKey.get(recognitionKey);

      if (!catalogEntry) {
        return undefined;
      }

      return {
        confidence:
          typeof candidate?.confidence === "number"
            ? Math.max(0.2, Math.min(0.99, candidate.confidence))
            : 0.72,
        domain: catalogEntry.domain,
        recognitionKey,
        selected: true,
        stickerAssetName: catalogEntry.stickerAssetName,
        targetObject: catalogEntry.targetObject,
      };
    })
    .filter((candidate) => {
      if (!candidate || seen.has(candidate.recognitionKey)) {
        return false;
      }

      seen.add(candidate.recognitionKey);
      return true;
    })
    .slice(0, 6);
};

const extractJsonObject = (content) => {
  try {
    return JSON.parse(content);
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");

    if (start >= 0 && end > start) {
      return JSON.parse(content.slice(start, end + 1));
    }

    throw new Error("Model did not return JSON");
  }
};

async function recognize(body) {
  if (!arkApiKey) {
    throw new Error("ARK_API_KEY is not configured");
  }

  const catalog = Array.isArray(body.catalog) ? body.catalog.slice(0, 120) : [];
  const catalogByKey = new Map(
    catalog
      .filter((entry) => entry?.key && entry?.stickerAssetName)
      .map((entry) => [
        String(entry.key),
        {
          aliases: Array.isArray(entry.aliases) ? entry.aliases.slice(0, 6) : [],
          domain: entry.domain === "drink" ? "drink" : "food",
          key: String(entry.key),
          label: String(entry.label || entry.key),
          stickerAssetName: String(entry.stickerAssetName),
          targetObject: entry.targetObject === "bottle" ? "bottle" : "bowl",
        },
      ]),
  );
  const promptCatalog = Array.from(catalogByKey.values());
  const sceneHint = String(body.sceneHint || "A pet food and drink capture");
  const imageDataUrl =
    typeof body.imageDataUrl === "string" && body.imageDataUrl.startsWith("data:image/")
      ? body.imageDataUrl
      : undefined;

  const prompt = [
    "You are PetFit's food and drink recognition mapper.",
    "PetFit has a fixed sticker asset catalog. You must choose recognitionKey values from that catalog only.",
    "Every catalog row maps to one existing stickerAssetName; never invent foods, drinks, keys, or asset names.",
    "If a visible item is not in the catalog, choose the nearest available catalog row such as veggie_assortment, combo_assorted_meals, water, or milk_tea.",
    "Return only JSON with this schema:",
    '{"suggestedTargetObject":"bowl|bottle","notes":"short Chinese note","candidates":[{"recognitionKey":"catalog key","confidence":0.0,"selected":true}]}',
    "The candidates array should contain 1 to 6 rows and each recognitionKey must exactly match one catalog key.",
    imageDataUrl
      ? "Use the provided image as the primary source. Prefer food/drink items visibly present in the photo."
      : "Prefer food/drink items visible or strongly implied by the scene hint.",
    "",
    `Scene hint: ${sceneHint}`,
    `Fixed sticker catalog: ${JSON.stringify(promptCatalog)}`,
  ].join("\n");

  const userContent = imageDataUrl
    ? [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: imageDataUrl } },
      ]
    : prompt;

  const response = await fetch(`${arkBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${arkApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content:
            "You map capture descriptions to a compact structured food/drink recognition result.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      model: arkModel,
      response_format: { type: "json_object" },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Ark request failed: ${response.status} ${detail.slice(0, 180)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error("Ark response missing message content");
  }

  const parsed = extractJsonObject(content);
  const candidates = normalizeCandidates(parsed, catalogByKey);

  return {
    candidates,
    notes: parsed.notes || "云端识别已完成",
    suggestedTargetObject:
      parsed.suggestedTargetObject === "bottle" ? "bottle" : "bowl",
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    return json(res, 204, {});
  }

  if (req.method === "GET" && req.url === "/api/health") {
    return json(res, 200, { ok: true, model: arkModel });
  }

  if (req.method === "POST" && req.url === "/api/recognize") {
    try {
      const body = await readBody(req);
      const result = await recognize(body);
      return json(res, 200, result);
    } catch (error) {
      return json(res, 500, {
        error: error instanceof Error ? error.message : "Recognition failed",
      });
    }
  }

  return json(res, 404, { error: "Not found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`PetFit API listening on http://127.0.0.1:${port}`);
});
