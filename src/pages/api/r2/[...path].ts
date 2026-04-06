import type { APIRoute } from "astro";
import { getR2Object } from "@/lib/r2";

export const GET: APIRoute = async ({ params }) => {
  const path = params.path;
  if (!path) {
    return new Response("Not Found", { status: 404 });
  }

  const result = await getR2Object(path);
  if (!result) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(result.body, {
    status: 200,
    headers: {
      "Content-Type": result.contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
};
