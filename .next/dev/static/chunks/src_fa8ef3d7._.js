(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/validators/schemas.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assignRoleSchema",
    ()=>assignRoleSchema,
    "categoryCreateSchema",
    ()=>categoryCreateSchema,
    "commentCreateSchema",
    ()=>commentCreateSchema,
    "newsCreateSchema",
    ()=>newsCreateSchema,
    "newsUpdateSchema",
    ()=>newsUpdateSchema,
    "signInSchema",
    ()=>signInSchema,
    "signUpSchema",
    ()=>signUpSchema,
    "tagCreateSchema",
    ()=>tagCreateSchema,
    "userUpdateSchema",
    ()=>userUpdateSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
;
const signUpSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'E-posta gereklidir').email('Geçerli bir e-posta adresi giriniz').toLowerCase().trim(),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(6, 'Şifre en az 6 karakter olmalıdır').max(100, 'Şifre çok uzun'),
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Şifre tekrarı gereklidir')
}).refine((data)=>data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: [
        'confirmPassword'
    ]
});
const signInSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'E-posta gereklidir').email('Geçerli bir e-posta adresi giriniz').toLowerCase().trim(),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Şifre gereklidir')
});
const newsCreateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(5, 'Başlık en az 5 karakterlikdir').max(200, 'Başlık en fazla 200 karakterlikdir').trim(),
    slug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(3, 'Slug en az 3 karakterlikdir').regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harfler, rakamlar ve tire içerebilir').optional(),
    excerpt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(10, 'Özet en az 10 karakterlikdir').max(500, 'Özet en fazla 500 karakterlikdir').trim(),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()).or(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any())),
    category_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid('Geçersiz kategori ID'),
    featured_image_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid('Geçersiz resim ID').optional(),
    seo_title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(60, 'SEO başlığı en fazla 60 karakterlikdir').optional(),
    meta_description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(50, 'Meta description en az 50 karakterlikdir').max(160, 'Meta description en fazla 160 karakterlikdir').optional(),
    focus_keyword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50, 'Focus keyword en fazla 50 karakterlikdir').optional(),
    featured: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    scheduled_at: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().datetime().optional()
});
const newsUpdateSchema = newsCreateSchema.partial().strict();
const commentCreateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    news_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid('Geçersiz haber ID'),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(3, 'Yorum en az 3 karakterlikdir').max(2000, 'Yorum en fazla 2000 karakterlikdir').trim()// XSS protection - basic
    .refine((val)=>!/<script|<iframe|javascript:/i.test(val), 'Yorum HTML/JavaScript içeremez')
});
const categoryCreateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(3, 'Kategori adı en az 3 karakterlikdir').max(50, 'Kategori adı en fazla 50 karakterlikdir').trim(),
    slug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harfler, rakamlar ve tire içerebilir'),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(300).optional(),
    icon_url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional(),
    order_index: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(0).optional()
});
const tagCreateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(2, 'Etiket en az 2 karakterlikdir').max(50, 'Etiket en fazla 50 karakterlikdir').trim(),
    slug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harfler, rakamlar ve tire içerebilir'),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(200).optional(),
    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().regex(/^#[0-9A-F]{6}$/i, 'Geçersiz hex renk').optional()
});
const userUpdateSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    full_name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(3).max(100).optional(),
    avatar_url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().optional(),
    bio: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(500).optional()
});
const assignRoleSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    user_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid(),
    role_id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().uuid()
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils/rateLimit.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Rate Limiting Utility
 * Client-side rate limiting için helper functions
 */ __turbopack_context__.s([
    "checkClientRateLimit",
    ()=>checkClientRateLimit,
    "resetRateLimit",
    ()=>resetRateLimit
]);
// Client-side rate limit storage (localStorage)
const CLIENT_RATE_LIMITS = {
    login: {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000
    },
    comment: {
        maxRequests: 10,
        windowMs: 60 * 1000
    },
    news: {
        maxRequests: 3,
        windowMs: 60 * 1000
    }
};
function checkClientRateLimit(action) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const config = CLIENT_RATE_LIMITS[action];
    const storageKey = `rate_limit_${action}`;
    const now = Date.now();
    try {
        const stored = localStorage.getItem(storageKey);
        let record;
        if (stored) {
            record = JSON.parse(stored);
            if (now > record.resetTime) {
                // Window expired, reset
                record = {
                    count: 1,
                    resetTime: now + config.windowMs
                };
            } else if (record.count >= config.maxRequests) {
                // Rate limit exceeded
                const retryAfter = Math.ceil((record.resetTime - now) / 1000);
                return {
                    allowed: false,
                    retryAfter,
                    remaining: 0
                };
            } else {
                // Increment count
                record.count++;
            }
        } else {
            // First request
            record = {
                count: 1,
                resetTime: now + config.windowMs
            };
        }
        localStorage.setItem(storageKey, JSON.stringify(record));
        return {
            allowed: true,
            remaining: config.maxRequests - record.count
        };
    } catch (error) {
        // localStorage error, allow request
        return {
            allowed: true
        };
    }
}
function resetRateLimit(action) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const storageKey = `rate_limit_${action}`;
    localStorage.removeItem(storageKey);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils/sanitization.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Security utilities for input sanitization and XSS/SQL injection prevention
 */ // ==========================================
// XSS PREVENTION
// ==========================================
/**
 * Enhanced HTML sanitization - remove script tags and dangerous attributes
 * Production-grade XSS protection
 */ __turbopack_context__.s([
    "createLikeQuery",
    ()=>createLikeQuery,
    "escapeHTML",
    ()=>escapeHTML,
    "escapeLikePattern",
    ()=>escapeLikePattern,
    "isSuspiciousInput",
    ()=>isSuspiciousInput,
    "normalizeWhitespace",
    ()=>normalizeWhitespace,
    "removeControlCharacters",
    ()=>removeControlCharacters,
    "sanitization",
    ()=>sanitization,
    "sanitizeEmail",
    ()=>sanitizeEmail,
    "sanitizeHTML",
    ()=>sanitizeHTML,
    "sanitizeInput",
    ()=>sanitizeInput,
    "sanitizeJSON",
    ()=>sanitizeJSON,
    "sanitizeSlug",
    ()=>sanitizeSlug,
    "unescapeHTML",
    ()=>unescapeHTML,
    "validateStringLength",
    ()=>validateStringLength
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
function sanitizeHTML(input) {
    if (!input) return '';
    let sanitized = input;
    // Remove script tags and content (including nested)
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // Remove style tags (can contain XSS)
    sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    // Remove iframe tags
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    // Remove object/embed tags
    sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
    sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
    // Remove event handlers (onclick, onerror, etc.)
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');
    // Remove javascript: and data: protocols
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/data:text\/html/gi, '');
    sanitized = sanitized.replace(/vbscript:/gi, '');
    // Remove expression() in styles
    sanitized = sanitized.replace(/expression\s*\(/gi, '');
    // Remove dangerous CSS
    sanitized = sanitized.replace(/@import/gi, '');
    // Remove base64 encoded content in src/href
    sanitized = sanitized.replace(/src\s*=\s*["']data:image\/[^"']*["']/gi, '');
    // Remove meta refresh
    sanitized = sanitized.replace(/<meta[^>]*http-equiv\s*=\s*["']refresh["'][^>]*>/gi, '');
    return sanitized;
}
function escapeHTML(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
        '/': '&#x2F;'
    };
    return text.replace(/[&<>"'\/]/g, (char)=>map[char]);
}
function unescapeHTML(text) {
    if (!text) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}
function escapeLikePattern(input) {
    return input.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}
function createLikeQuery(searchTerm) {
    const escaped = escapeLikePattern(searchTerm);
    return `%${escaped}%`;
}
function normalizeWhitespace(text) {
    return text.trim().replace(/\s+/g, ' ');
}
function sanitizeSlug(slug) {
    return slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}
function sanitizeEmail(email) {
    return email.toLowerCase().trim();
}
function removeControlCharacters(input) {
    return input.replace(/[\x00-\x1F\x7F]/g, '');
}
function sanitizeJSON(obj, depth = 0) {
    if (depth > 10) return null // Prevent deep nesting attacks
    ;
    if (Array.isArray(obj)) {
        return obj.map((item)=>sanitizeJSON(item, depth + 1));
    }
    if (obj !== null && typeof obj === 'object') {
        const cleaned = {};
        for(const key in obj){
            // Skip keys that might be dangerous
            if (!key.startsWith('__') && !key.includes('eval') && !key.includes('constructor')) {
                cleaned[key] = sanitizeJSON(obj[key], depth + 1);
            }
        }
        return cleaned;
    }
    if (typeof obj === 'string') {
        return removeControlCharacters(obj);
    }
    return obj;
}
function sanitizeInput(input, type = 'text') {
    let sanitized = input;
    // Always remove control characters
    sanitized = removeControlCharacters(sanitized);
    // Type-specific sanitization
    switch(type){
        case 'html':
            sanitized = sanitizeHTML(sanitized);
            break;
        case 'email':
            sanitized = sanitizeEmail(sanitized);
            break;
        case 'slug':
            sanitized = sanitizeSlug(sanitized);
            break;
        case 'url':
            try {
                const url = new URL(sanitized);
                // Sadece http ve https protokollerine izin ver
                if (![
                    'http:',
                    'https:'
                ].includes(url.protocol)) {
                    sanitized = '';
                }
                // JavaScript ve data protokollerini engelle
                if (url.protocol === 'javascript:' || url.protocol === 'data:') {
                    sanitized = '';
                }
                // Hostname validation - sadece güvenli domain'lere izin ver
                const allowedDomains = [
                    'supabase.co',
                    'supabase.in',
                    'picsum.photos',
                    'dikilihaber.com',
                    'localhost'
                ];
                const hostname = url.hostname.toLowerCase();
                // Eğer production'da ise, sadece whitelist'teki domain'lere izin ver
                if (("TURBOPACK compile-time value", "development") === 'production' && !allowedDomains.some((domain)=>hostname.includes(domain))) {
                // Production'da sadece güvenli domain'lere izin ver
                // Development'ta tüm domain'lere izin ver
                }
            } catch  {
                sanitized = '';
            }
            break;
        case 'text':
        default:
            sanitized = sanitizeHTML(sanitized);
            sanitized = normalizeWhitespace(sanitized);
    }
    return sanitized;
}
function isSuspiciousInput(input) {
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /eval\(/i,
        /expression\s*\(/i,
        /vbscript:/i,
        /behavior:/i,
        /url\s*\(/i
    ];
    return suspiciousPatterns.some((pattern)=>pattern.test(input));
}
function validateStringLength(input, { min = 1, max = 10000 } = {}) {
    if (!input || typeof input !== 'string') return false;
    const length = input.trim().length;
    return length >= min && length <= max;
}
const sanitization = {
    sanitizeHTML,
    escapeHTML,
    unescapeHTML,
    escapeLikePattern,
    createLikeQuery,
    normalizeWhitespace,
    sanitizeSlug,
    sanitizeEmail,
    removeControlCharacters,
    sanitizeJSON,
    sanitizeInput,
    isSuspiciousInput,
    validateStringLength
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/auth/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validators$2f$schemas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/validators/schemas.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/logger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$rateLimit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/rateLimit.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$sanitization$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/sanitization.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
function LoginPage() {
    _s();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [fieldErrors, setFieldErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const { signIn } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    // URL parametrelerini kontrol et
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LoginPage.useEffect": ()=>{
            const verified = searchParams.get('verified');
            const errorParam = searchParams.get('error');
            if (verified === 'true') {
                setSuccess('✅ E-posta doğrulaması başarılı! Giriş yapabilirsiniz.');
            }
            if (errorParam === 'verification_failed') {
                setError('❌ E-posta doğrulaması başarısız. Lütfen tekrar deneyin.');
            }
        }
    }["LoginPage.useEffect"], [
        searchParams
    ]);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});
        // Rate limiting kontrolü
        const rateLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$rateLimit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkClientRateLimit"])('login');
        if (!rateLimit.allowed) {
            setError(`Çok fazla deneme yaptınız. Lütfen ${Math.ceil((rateLimit.retryAfter || 0) / 60)} dakika sonra tekrar deneyin.`);
            setLoading(false);
            return;
        }
        // Input sanitization
        const sanitizedEmail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$sanitization$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeInput"])(email, 'email');
        const sanitizedPassword = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$sanitization$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeInput"])(password, 'text');
        // Client-side validation
        const validationResult = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validators$2f$schemas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInSchema"].safeParse({
            email: sanitizedEmail,
            password: sanitizedPassword
        });
        if (!validationResult.success) {
            const errors = {};
            validationResult.error.issues.forEach((err)=>{
                const field = err.path[0];
                if (typeof field === 'string') {
                    if (field === 'email') {
                        errors.email = err.message === 'Invalid email' ? 'Geçerli bir e-posta adresi giriniz' : err.message;
                    } else if (field === 'password') {
                        errors.password = err.message === 'String must contain at least 6 character(s)' ? 'Şifre en az 6 karakter olmalıdır' : err.message;
                    }
                }
            });
            setFieldErrors(errors);
            setLoading(false);
            return;
        }
        try {
            const result = await signIn(sanitizedEmail, sanitizedPassword);
            // Başarılı girişte rate limit'i sıfırla
            if (!result.error) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$rateLimit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resetRateLimit"])('login');
            }
            if (result.error) {
                setError(result.error.message);
                setLoading(false);
                return;
            }
            // Başarılı giriş - admin kontrolü yap
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"]) {
                setError('Supabase yapılandırılmamış. Lütfen .env.local dosyasını kontrol edin.');
                setLoading(false);
                return;
            }
            const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
            if (!user) {
                setError('Giriş başarısız. Lütfen tekrar deneyin.');
                setLoading(false);
                return;
            }
            // E-posta doğrulaması kontrolü (opsiyonel - development için kapatılabilir)
            // const emailConfirmed = user.email_confirmed_at || (user as any).confirmed_at
            // if (!emailConfirmed) {
            //   setError('E-posta doğrulaması yapılmamış. Lütfen e-postanızı kontrol edin.')
            //   await supabase.auth.signOut()
            //   setLoading(false)
            //   return
            // }
            // Admin kontrolü - maybeSingle kullan (hata vermez)
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].log('🔍 Admin kontrolü başlatılıyor...', {
                userId: user.id,
                email: user.email
            });
            const { data: adminUser, error: adminError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('admins').select('user_id, role, email').eq('user_id', user.id).maybeSingle();
            // Hata kontrolü - sessizce handle et
            if (adminError) {
                // PGRST116 = No rows returned (kullanıcı admin değil - bu normal, hata değil)
                if (adminError.code === 'PGRST116') {
                    // Kullanıcı admin değil - normal durum
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].log('Kullanıcı admin değil:', user.email);
                    setError('Giriş başarılı. Bu hesap admin yetkisine sahip değil.');
                    setLoading(false);
                    setTimeout(()=>{
                        router.push('/');
                    }, 2000);
                    return;
                }
                // Tablo yoksa - kurulum yapılmamış
                if (adminError.code === '42P01' || adminError.message?.includes('relation') || adminError.message?.includes('does not exist') || adminError.message?.includes('table') && adminError.message?.includes('not exist')) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].log('Database kurulumu eksik - admins tablosu bulunamadı');
                    setError('⚠️ Database kurulumu eksik!\n\n' + 'Otomatik kurulum için: /setup-admin sayfasına gidin\n\n' + 'Veya manuel kurulum:\n' + '1. Supabase Dashboard > SQL Editor\n' + '2. SETUP_ADMIN.sql dosyasını çalıştırın\n\n' + 'Kurulumdan sonra sayfayı yenileyin.');
                    setLoading(false);
                    return;
                }
                // RLS hatası
                if (adminError.code === '42501' || adminError.message?.includes('permission') || adminError.message?.includes('policy') || adminError.message?.includes('row-level security')) {
                    // Sessizce handle et - kullanıcıya zaten UI'da mesaj gösteriliyor
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].log('RLS Policy hatası:', adminError.code);
                    setError('Yetkilendirme hatası. Lütfen database kurulumunu kontrol edin.');
                    setLoading(false);
                    return;
                }
                // Diğer hatalar - sessizce handle et
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].log('Admin kontrol hatası:', adminError.code);
                setError('Giriş başarılı ancak admin kontrolü yapılamadı. Normal kullanıcı olarak devam ediliyor.');
                setLoading(false);
                setTimeout(()=>{
                    router.push('/');
                }, 2000);
                return;
            }
            // Admin kontrolü başarılı
            if (adminUser) {
                const role = adminUser?.role;
                const isAllowedAdmin = role === 'admin' || role === 'super_admin' || !role;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].log('✅ Admin user bulundu:', {
                    email: adminUser.email || user.email,
                    role: role || 'legacy',
                    isAllowed: isAllowedAdmin
                });
                if (isAllowedAdmin) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].log('✅ Admin user confirmed, redirecting to admin panel');
                    setLoading(false);
                    router.push('/admin');
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].log('❌ User has admin record but role is not allowed:', role);
                    setError('Bu hesap admin yetkisine sahip değil.');
                    setLoading(false);
                    setTimeout(()=>{
                        router.push('/');
                    }, 2000);
                }
            } else {
                // Admin değil - normal kullanıcı olarak giriş yapıldı
                setError('Giriş başarılı. Bu hesap admin yetkisine sahip değil.');
                setLoading(false);
                setTimeout(()=>{
                    router.push('/');
                }, 2000);
            }
        } catch (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Login error:', err);
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sm:mx-auto sm:w-full sm:max-w-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mt-6 text-center text-3xl font-extrabold text-gray-900",
                        children: "DikiliHaber'a Giriş Yap"
                    }, void 0, false, {
                        fileName: "[project]/src/app/auth/login/page.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-center text-sm text-gray-600",
                        children: [
                            "Hesabınız yok mu?",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/auth/register",
                                className: "font-medium text-primary hover:text-blue-500",
                                children: "Kayıt olun"
                            }, void 0, false, {
                                fileName: "[project]/src/app/auth/login/page.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/auth/login/page.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/auth/login/page.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "space-y-6",
                            onSubmit: handleSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "email",
                                            className: "block text-sm font-medium text-gray-700",
                                            children: "E-posta Adresi"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/auth/login/page.tsx",
                                            lineNumber: 232,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "email",
                                                    name: "email",
                                                    type: "email",
                                                    autoComplete: "email",
                                                    required: true,
                                                    value: email,
                                                    onChange: (e)=>{
                                                        setEmail(e.target.value);
                                                        if (fieldErrors.email) setFieldErrors({
                                                            ...fieldErrors,
                                                            email: undefined
                                                        });
                                                    },
                                                    className: `appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${fieldErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/auth/login/page.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 17
                                                }, this),
                                                fieldErrors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-red-600",
                                                    children: fieldErrors.email
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/auth/login/page.tsx",
                                                    lineNumber: 252,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/auth/login/page.tsx",
                                            lineNumber: 235,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/auth/login/page.tsx",
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: "password",
                                            className: "block text-sm font-medium text-gray-700",
                                            children: "Şifre"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/auth/login/page.tsx",
                                            lineNumber: 258,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "password",
                                                    name: "password",
                                                    type: "password",
                                                    autoComplete: "current-password",
                                                    required: true,
                                                    value: password,
                                                    onChange: (e)=>{
                                                        setPassword(e.target.value);
                                                        if (fieldErrors.password) setFieldErrors({
                                                            ...fieldErrors,
                                                            password: undefined
                                                        });
                                                    },
                                                    className: `appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${fieldErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/auth/login/page.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 17
                                                }, this),
                                                fieldErrors.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-sm text-red-600",
                                                    children: fieldErrors.password
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/auth/login/page.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/auth/login/page.tsx",
                                            lineNumber: 261,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/auth/login/page.tsx",
                                    lineNumber: 257,
                                    columnNumber: 13
                                }, this),
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm text-center",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/src/app/auth/login/page.tsx",
                                    lineNumber: 284,
                                    columnNumber: 15
                                }, this),
                                success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm text-center",
                                    children: success
                                }, void 0, false, {
                                    fileName: "[project]/src/app/auth/login/page.tsx",
                                    lineNumber: 290,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: loading,
                                        className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed",
                                        children: loading ? 'Giriş yapılıyor...' : 'Giriş Yap'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/login/page.tsx",
                                        lineNumber: 296,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/auth/login/page.tsx",
                                    lineNumber: 295,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/auth/login/page.tsx",
                            lineNumber: 230,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 flex items-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full border-t border-gray-300"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/login/page.tsx",
                                                lineNumber: 309,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/auth/login/page.tsx",
                                            lineNumber: 308,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex justify-center text-sm",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "px-2 bg-white text-gray-500",
                                                children: "Veya"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/login/page.tsx",
                                                lineNumber: 312,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/auth/login/page.tsx",
                                            lineNumber: 311,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/auth/login/page.tsx",
                                    lineNumber: 307,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 text-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/",
                                        className: "text-primary hover:text-blue-500",
                                        children: "Ana sayfaya dön"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/login/page.tsx",
                                        lineNumber: 317,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/auth/login/page.tsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/auth/login/page.tsx",
                            lineNumber: 306,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/auth/login/page.tsx",
                    lineNumber: 229,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/auth/login/page.tsx",
                lineNumber: 228,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/auth/login/page.tsx",
        lineNumber: 215,
        columnNumber: 5
    }, this);
}
_s(LoginPage, "fXyGPpxcTBUzKOnwLuLWUlNnJdU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = LoginPage;
var _c;
__turbopack_context__.k.register(_c, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_fa8ef3d7._.js.map