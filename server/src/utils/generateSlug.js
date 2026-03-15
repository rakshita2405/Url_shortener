import { nanoid } from "nanoid";

export default async function generateSlug() {
  return nanoid(6);
}