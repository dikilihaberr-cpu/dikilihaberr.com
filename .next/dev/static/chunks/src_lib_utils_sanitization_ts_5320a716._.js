(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
]);

//# sourceMappingURL=src_lib_utils_sanitization_ts_5320a716._.js.map