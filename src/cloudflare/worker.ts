import { handle } from "@astrojs/cloudflare/handler";

// For modularity, export all from your durable objects here
// e.g. export * from "./durable-objects/ExampleDurableObject";

const HTML_EDGE_TTL_SECONDS = 60 * 60 * 24;
const HTML_BROWSER_TTL_SECONDS = 60 * 5;
const IMAGE_EDGE_TTL_SECONDS = 60 * 60 * 24 * 7;
const IMAGE_BROWSER_TTL_SECONDS = 60 * 60;

interface CacheRule {
    edgeTtlSeconds: number;
    browserTtlSeconds: number;
}

function getCacheRule(request: Request): CacheRule | null {
    if (request.method !== "GET") return null;

    const { pathname } = new URL(request.url);
    const isNovelListPage = pathname === "/novels" || pathname === "/novels/";
    const isNovelDetailPage = /^\/novels\/[^/]+\/?$/.test(pathname);
    const isChapterPage = /^\/novels\/[^/]+\/chapters\/[^/]+\/?$/.test(pathname);
    const isCoverArt = /^\/api\/r2\/novels\/[^/]+\/assets\/cover_art\.(?:jpe?g|png|webp|gif|svg)$/i.test(
        pathname
    );

    if (isNovelListPage || isNovelDetailPage || isChapterPage) {
        return {
            edgeTtlSeconds: HTML_EDGE_TTL_SECONDS,
            browserTtlSeconds: HTML_BROWSER_TTL_SECONDS,
        };
    }

    if (isCoverArt) {
        return {
            edgeTtlSeconds: IMAGE_EDGE_TTL_SECONDS,
            browserTtlSeconds: IMAGE_BROWSER_TTL_SECONDS,
        };
    }

    return null;
}

function createCacheKey(request: Request): Request {
    const url = new URL(request.url);
    url.search = "";
    return new Request(url.toString(), request);
}

function withCacheHeaders(
    response: Response,
    rule: CacheRule,
    cacheStatus: "HIT" | "MISS" | "BYPASS"
): Response {
    const headers = new Headers(response.headers);
    headers.set(
        "Cache-Control",
        `public, max-age=${rule.browserTtlSeconds}, s-maxage=${rule.edgeTtlSeconds}`
    );
    headers.set("X-Edge-Cache", cacheStatus);
    headers.set("X-Edge-Cache-TTL", String(rule.edgeTtlSeconds));

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}

async function fetchWithEdgeCache(
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    const cacheRule = getCacheRule(request);
    if (!cacheRule) {
        return handle(request, env, ctx);
    }

    const cache = (caches as CacheStorage & { default: Cache }).default;
    const cacheKey = createCacheKey(request);
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
        return withCacheHeaders(cachedResponse, cacheRule, "HIT");
    }

    const originResponse = await handle(request, env, ctx);
    if (originResponse.status !== 200 || originResponse.headers.has("Set-Cookie")) {
        return withCacheHeaders(originResponse, cacheRule, "BYPASS");
    }

    const response = withCacheHeaders(originResponse, cacheRule, "MISS");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
}

export default {
    async fetch(request, env, ctx) {
        return fetchWithEdgeCache(request, env, ctx);
    },
    async queue(batch, _env) {
        let messages = JSON.stringify(batch.messages);
        console.log(`consumed from our queue: ${messages}`);
    },
    async scheduled(_event, _env, _ctx) {
        // Do some time logic here
    },
} satisfies ExportedHandler<Env>;
