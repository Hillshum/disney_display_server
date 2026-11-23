import defaults from "./queueIds.json" with { type: "json" };
import { readFileSync } from "fs";

const QUEUE_ID_PATH = process.env.QUEUE_ID_PATH;

const getQueueIds = () => {
  if (!QUEUE_ID_PATH) {
    console.warn(
      "QUEUE_ID_PATH environment variable not set, using default queueIds.json",
    );
    return defaults;
  }

  try {
    const data = readFileSync(QUEUE_ID_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading queue IDs from ${QUEUE_ID_PATH}:`, err);
    console.warn("Using default queueIds.json instead.");
    return defaults;
  }
};

export default getQueueIds;
