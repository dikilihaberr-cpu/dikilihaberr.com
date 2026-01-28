(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__8978dbac._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
// Rate limiting storage (in-memory, production'da Redis kullanılmalı)
const rateLimitMap = new Map();
// Rate limiting configuration
const RATE_LIMITS = {
    '/api/auth/login': {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000
    },
    '/api/comments': {
        maxRequests: 10,
        windowMs: 60 * 1000
    },
    default: {
        maxRequests: 100,
        windowMs: 60 * 1000
    }
};
function getRateLimitConfig(pathname) {
    if (pathname.includes('/api/auth/login')) return RATE_LIMITS['/api/auth/login'];
    if (pathname.includes('/api/comments')) return RATE_LIMITS['/api/comments'];
    return RATE_LIMITS.default;
}
function checkRateLimit(ip, pathname) {
    const config = getRateLimitConfig(pathname);
    const now = Date.now();
    // IP sanitization - prevent injection attacks
    const sanitizedIp = ip.replace(/[^a-zA-Z0-9.:-]/g, '');
    const sanitizedPathname = pathname.replace(/[^a-zA-Z0-9/_-]/g, '');
    const key = `${sanitizedIp}:${sanitizedPathname}`;
    const record = rateLimitMap.get(key);
    if (!record || now > record.resetTime) {
        // Yeni window başlat
        rateLimitMap.set(key, {
            count: 1,
            resetTime: now + config.windowMs
        });
        return {
            allowed: true
        };
    }
    if (record.count >= config.maxRequests) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return {
            allowed: false,
            retryAfter
        };
    }
    // Count artır
    record.count++;
    rateLimitMap.set(key, record);
    return {
        allowed: true
    };
}
// Cleanup old entries (her 5 dakikada bir)
setInterval(()=>{
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()){
        if (now > value.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000);
function middleware(request) {
    const { pathname } = request.nextUrl;
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    // Rate limiting kontrolü (sadece API routes için)
    if (pathname.startsWith('/api/')) {
        const rateLimit = checkRateLimit(ip, pathname);
        if (!rateLimit.allowed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Too many requests',
                message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.',
                retryAfter: rateLimit.retryAfter
            }, {
                status: 429,
                headers: {
                    'Retry-After': String(rateLimit.retryAfter),
                    'X-RateLimit-Limit': String(getRateLimitConfig(pathname).maxRequests),
                    'X-RateLimit-Remaining': '0'
                }
            });
        }
    }
    // Security Headers ekle
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    // Content Security Policy
    const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
        "frame-src 'self' https://*.supabase.co",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests"
    ].join('; ');
    // Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('Content-Security-Policy', csp);
    // Rate limit headers (API routes için)
    if (pathname.startsWith('/api/')) {
        const config = getRateLimitConfig(pathname);
        const record = rateLimitMap.get(`${ip}:${pathname}`);
        const remaining = record ? Math.max(0, config.maxRequests - record.count) : config.maxRequests;
        response.headers.set('X-RateLimit-Limit', String(config.maxRequests));
        response.headers.set('X-RateLimit-Remaining', String(remaining));
    }
    return response;
}
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */ '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__8978dbac._.js.map