import { createReadStream, readFileSync } from "node:fs";
import { join } from "node:path";
import tar from "tar-fs";

interface Asset {
  pointsOfInterest: {
    [key: string]: string;
  };
  shotID: string;
  previewImage: string;
  accessibilityLabel: string;
  categories: string[];
  id: string;
  "url-4K-SDR-240FPS": string;
  subcategories: string[];
  "url-4K-SDR-120FPS": string;
}

// Get the path to the tarball from the arguments

const tarballPath = process.argv[2];
const target = `/tmp/aerial-parser-${Date.now()}`;

// https://gist.github.com/theothernt/57a51cade0c12c407f48a5121e0939d5

function extractTarball() {
  // Extract the tarball
  const tarfs = createReadStream(tarballPath).pipe(tar.extract(target));

  tarfs.on("finish", () => {
    parseEntries();
  });
}

export async function parseEntries() {
  const data = readFileSync(join(target, "entries.json"));
  const parsed = JSON.parse(data.toString());
  const assets = parsed.assets as Asset[];

  const filteredAssets = assets.filter((e) => e["url-4K-SDR-120FPS"]).map((e) => {
    return {
      url: e["url-4K-SDR-120FPS"],
      id: e.id,
      name: e.accessibilityLabel,
    }
  })


}

extractTarball();
