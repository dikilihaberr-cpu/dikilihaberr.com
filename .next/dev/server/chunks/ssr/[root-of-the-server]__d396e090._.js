module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/components/ui/NewsCard.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// NewsCard component
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-rsc] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-rsc] (ecmascript) <export default as ArrowRight>");
;
;
;
;
const NewsCard = ({ title, category, publishedAt, imageUrl, slug, excerpt })=>{
    const CardContent = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "news-card group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative h-48 mb-4 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            src: imageUrl || 'https://picsum.photos/400/300?random=1',
                            alt: title || 'Haber',
                            fill: true,
                            className: "object-cover transition-transform duration-300 group-hover:scale-110",
                            sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/NewsCard.tsx",
                            lineNumber: 20,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-2 left-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "bg-accent text-white px-2 py-1 rounded text-xs font-medium",
                                children: category
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/NewsCard.tsx",
                                lineNumber: 28,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/NewsCard.tsx",
                            lineNumber: 27,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/NewsCard.tsx",
                            lineNumber: 32,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/NewsCard.tsx",
                    lineNumber: 19,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/NewsCard.tsx",
                            lineNumber: 35,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        excerpt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-600 mb-3 line-clamp-2",
                            children: excerpt
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/NewsCard.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center text-sm text-gray-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                            className: "h-4 w-4 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/NewsCard.tsx",
                                            lineNumber: 45,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: publishedAt
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/NewsCard.tsx",
                                            lineNumber: 46,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/NewsCard.tsx",
                                    lineNumber: 44,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                slug && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center text-primary group-hover:text-blue-700 font-medium text-sm transition-colors",
                                    children: [
                                        "Devamını Oku",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            className: "h-4 w-4 ml-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/NewsCard.tsx",
                                            lineNumber: 51,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/NewsCard.tsx",
                                    lineNumber: 49,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/NewsCard.tsx",
                            lineNumber: 43,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/NewsCard.tsx",
                    lineNumber: 34,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/NewsCard.tsx",
            lineNumber: 18,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0));
    if (slug) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
            href: `/news/${slug}`,
            className: "block cursor-pointer",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {}, void 0, false, {
                fileName: "[project]/src/components/ui/NewsCard.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/ui/NewsCard.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(CardContent, {}, void 0, false, {
        fileName: "[project]/src/components/ui/NewsCard.tsx",
        lineNumber: 67,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = NewsCard;
}),
"[project]/src/lib/supabase.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addComment",
    ()=>addComment,
    "addNews",
    ()=>addNews,
    "deleteComment",
    ()=>deleteComment,
    "deleteNews",
    ()=>deleteNews,
    "getAllNews",
    ()=>getAllNews,
    "getAllNewsAdmin",
    ()=>getAllNewsAdmin,
    "getCommentsByNewsId",
    ()=>getCommentsByNewsId,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getFeaturedNews",
    ()=>getFeaturedNews,
    "getMostViewedNews",
    ()=>getMostViewedNews,
    "getNewsByCategory",
    ()=>getNewsByCategory,
    "getNewsById",
    ()=>getNewsById,
    "getNewsBySlug",
    ()=>getNewsBySlug,
    "getPendingComments",
    ()=>getPendingComments,
    "getSession",
    ()=>getSession,
    "getTodayNews",
    ()=>getTodayNews,
    "getUnreadTips",
    ()=>getUnreadTips,
    "isAdmin",
    ()=>isAdmin,
    "saveDraft",
    ()=>saveDraft,
    "searchImages",
    ()=>searchImages,
    "searchNews",
    ()=>searchNews,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut,
    "signUp",
    ()=>signUp,
    "supabase",
    ()=>supabase,
    "updateComment",
    ()=>updateComment,
    "updateNews",
    ()=>updateNews,
    "uploadImage",
    ()=>uploadImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://suhklarwjeedtabcusgz.supabase.co") || 'https://placeholder.supabase.co';
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aGtsYXJ3amVlZHRhYmN1c2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NDY1NDAsImV4cCI6MjA4NDIyMjU0MH0.Nul4ypXBlBh9Jh-4Cwq87vIUoarVhgOFtAckLcFAnDA") || 'placeholder-key';
let supabase = null;
// Only create client if we have valid credentials
if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder') && !supabaseAnonKey.includes('placeholder') && supabaseUrl.startsWith('http')) {
    try {
        supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        });
        console.log('Supabase client initialized successfully');
    } catch (error) {
        console.warn('Failed to create Supabase client:', error);
    }
} else {
    console.warn('Supabase credentials not properly configured');
}
;
const signUp = async (email, password)=>{
    if (!supabase) return {
        error: 'Supabase not initialized'
    };
    return await supabase.auth.signUp({
        email,
        password
    });
};
const signIn = async (email, password)=>{
    if (!supabase) return {
        error: 'Supabase not initialized'
    };
    return await supabase.auth.signInWithPassword({
        email,
        password
    });
};
const signOut = async ()=>{
    if (!supabase) return {
        error: 'Supabase not initialized'
    };
    return await supabase.auth.signOut();
};
const getCurrentUser = async ()=>{
    if (!supabase) return null;
    return await supabase.auth.getUser();
};
const getSession = async ()=>{
    if (!supabase) return null;
    return await supabase.auth.getSession();
};
const isAdmin = async ()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    // Check if user has admin role in user metadata or a separate admins table
    const { data: adminUser } = await supabase.from('admins').select('*').eq('user_id', user.id).single();
    return !!adminUser;
};
const getCommentsByNewsId = async (newsId, includePending)=>{
    if (!supabase) return [];
    let query = supabase.from('comments').select('*').eq('news_id', newsId);
    // Only show approved comments unless includePending is true
    if (!includePending) {
        query = query.eq('is_approved', true).eq('is_hidden', false);
    }
    try {
        const { data, error } = await query.order('created_at', {
            ascending: true
        });
        if (error) {
            return [];
        }
        return data || [];
    } catch (err) {
        return [];
    }
};
const addComment = async (newsId, content)=>{
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from('comments').insert([
        {
            news_id: newsId,
            user_id: user.id,
            user_email: user.email,
            user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            content: content.trim()
        }
    ]).select().single();
    if (error) {
        console.error('Error adding comment:', error);
        return null;
    }
    return data;
};
const updateComment = async (commentId, content)=>{
    if (!supabase) return null;
    const { data, error } = await supabase.from('comments').update({
        content: content.trim(),
        updated_at: new Date().toISOString()
    }).eq('id', commentId).select().single();
    if (error) {
        console.error('Error updating comment:', error);
        return null;
    }
    return data;
};
const deleteComment = async (commentId)=>{
    if (!supabase) return false;
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) {
        console.error('Error deleting comment:', error);
        return false;
    }
    return true;
};
const getAllNews = async ()=>{
    if (!supabase) {
        return [];
    }
    try {
        // RLS policy zaten filtreliyor - query'de filtreleme yapmıyoruz
        // RLS policy: status = 'published' AND is_published = TRUE
        const { data, error } = await supabase.from('news').select('*').order('published_at', {
            ascending: false
        });
        if (error) {
            // Sessizce boş array döndür - hata yönetimi component seviyesinde
            return [];
        }
        return data || [];
    } catch (err) {
        // Sessizce boş array döndür
        return [];
    }
};
const getNewsById = async (id)=>{
    if (!supabase) {
        return null;
    }
    try {
        const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
        if (error) {
            return null;
        }
        return data;
    } catch (err) {
        return null;
    }
};
const getNewsBySlug = async (slug)=>{
    if (!supabase) {
        return null;
    }
    try {
        const { data, error } = await supabase.from('news').select('*').eq('slug', slug).single();
        if (error) {
            return null;
        }
        return data;
    } catch (err) {
        return null;
    }
};
const getNewsByCategory = async (category)=>{
    if (!supabase) {
        return [];
    }
    try {
        const { data, error } = await supabase.from('news').select('*').eq('category', category).order('published_at', {
            ascending: false
        });
        if (error) {
            return [];
        }
        return data || [];
    } catch (err) {
        return [];
    }
};
const getFeaturedNews = async ()=>{
    if (!supabase) {
        return [];
    }
    try {
        // RLS policy zaten filtreliyor - sadece featured filtresi ekliyoruz
        // RLS policy: status = 'published' AND is_published = TRUE
        const { data, error } = await supabase.from('news').select('*').eq('featured', true).order('published_at', {
            ascending: false
        }).limit(5);
        if (error) {
            // Sessizce boş array döndür - hata yönetimi component seviyesinde
            return [];
        }
        return data || [];
    } catch (err) {
        // Sessizce boş array döndür
        return [];
    }
};
const addNews = async (news)=>{
    if (!supabase) {
        console.error('Supabase client not initialized');
        return null;
    }
    try {
        // Create a unique slug
        let slug = news.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
        // Check if slug already exists and make it unique
        let counter = 1;
        let originalSlug = slug;
        while(true){
            const { data: existing } = await supabase.from('news').select('id').eq('slug', slug).single();
            if (!existing) break;
            slug = `${originalSlug}-${counter}`;
            counter++;
        }
        const newsData = {
            title: news.title,
            excerpt: news.excerpt,
            content: news.content,
            category: news.category,
            author: news.author,
            featured: news.featured,
            image_url: news.image_url,
            images: news.images || [],
            video_url: news.video_url || null,
            is_published: news.is_published || false,
            is_draft: news.is_draft || false,
            slug,
            published_at: news.is_published ? new Date().toISOString() : null
        };
        console.log('Adding news with data:', newsData);
        const { data, error } = await supabase.from('news').insert([
            newsData
        ]).select().single();
        if (error) {
            console.error('Supabase insert error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            console.error('Error details:', error.details || 'No details available');
            console.error('Error hint:', error.hint || 'No hint available');
            return null;
        }
        console.log('News added successfully:', data);
        return data;
    } catch (err) {
        console.error('Unexpected error in addNews:', err);
        if (err instanceof Error) {
            console.error('Error name:', err.name);
            console.error('Error message:', err.message);
            console.error('Error stack:', err.stack);
        }
        return null;
    }
};
const saveDraft = async (news)=>{
    if (!supabase) {
        console.error('Supabase client not initialized');
        return false;
    }
    try {
        // Create a unique slug for drafts
        let slug = `draft-${(news.title || 'untitled').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()}-${Date.now()}`;
        const draftData = {
            title: news.title,
            excerpt: news.excerpt,
            content: news.content,
            category: news.category,
            author: news.author,
            featured: news.featured,
            image_url: news.image_url,
            images: news.images || [],
            video_url: news.video_url || null,
            is_published: news.is_published || false,
            is_draft: news.is_draft || true,
            slug,
            published_at: null
        };
        console.log('Saving draft with data:', draftData);
        const { data, error } = await supabase.from('news').insert([
            draftData
        ]).select().single();
        if (error) {
            console.error('Supabase insert error for draft:', error);
            return false;
        }
        console.log('Draft saved successfully:', data);
        return true;
    } catch (err) {
        console.error('Unexpected error in saveDraft:', err);
        return false;
    }
};
const updateNews = async (id, updates)=>{
    if (!supabase) {
        return null;
    }
    const { data, error } = await supabase.from('news').update(updates).eq('id', id).select().single();
    if (error) {
        console.error('Error updating news:', error);
        return null;
    }
    return data;
};
const deleteNews = async (id)=>{
    if (!supabase) {
        return false;
    }
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) {
        console.error('Error deleting news:', error);
        return false;
    }
    return true;
};
const uploadImage = async (file, folder = 'news-images')=>{
    if (!supabase) {
        console.error('Supabase client not initialized');
        return null;
    }
    try {
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage.from('images').upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });
        if (error) {
            console.error('Error uploading image:', error);
            return null;
        }
        // Get public URL
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        console.log('Image uploaded successfully:', publicUrl);
        return publicUrl;
    } catch (error) {
        console.error('Unexpected error uploading image:', error);
        return null;
    }
};
const searchImages = async (query)=>{
    try {
        // This would normally use Google Custom Search API
        // For now, return placeholder images
        const mockResults = [
            `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}+1`,
            `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}+2`,
            `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}+3`,
            `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}+4`,
            `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}+5`,
            `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}+6`
        ];
        // Simulate API delay
        await new Promise((resolve)=>setTimeout(resolve, 1500));
        return mockResults;
    } catch (error) {
        return [];
    }
};
const getAllNewsAdmin = async ()=>{
    if (!supabase) return [];
    const { data, error } = await supabase.from('news').select('*').order('created_at', {
        ascending: false
    });
    if (error) {
        console.error('Error fetching admin news:', error);
        return [];
    }
    return data || [];
};
const getTodayNews = async ()=>{
    if (!supabase) return [];
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.from('news').select('*').gte('created_at', `${today}T00:00:00`).lte('created_at', `${today}T23:59:59`).order('created_at', {
        ascending: false
    });
    if (error) {
        console.error('Error fetching today news:', error);
        return [];
    }
    return data || [];
};
const getMostViewedNews = async (limit = 5)=>{
    if (!supabase) return [];
    const { data, error } = await supabase.from('news').select('*').order('created_at', {
        ascending: false
    }).limit(limit);
    if (error) {
        console.error('Error fetching most viewed news:', error);
        return [];
    }
    return data || [];
};
const getPendingComments = async ()=>{
    if (!supabase) return [];
    const { data, error } = await supabase.from('comments').select('*, news(title)').order('created_at', {
        ascending: false
    }).limit(10);
    if (error) {
        console.error('Error fetching pending comments:', error);
        return [];
    }
    return (data || []).map((comment)=>({
            ...comment,
            news_title: comment.news?.title || 'Unknown'
        }));
};
const getUnreadTips = async ()=>{
    if (!supabase) return [];
    const { data, error } = await supabase.from('comments').select('*').eq('status', 'pending').order('created_at', {
        ascending: false
    }).limit(10);
    if (error) {
        console.error('Error fetching tips:', error);
        return [];
    }
    return (data || []).map((item)=>({
            id: item.id,
            content: item.content,
            source: item.user_email || item.user_name || 'Anonymous',
            created_at: item.created_at,
            status: 'pending'
        }));
};
const searchNews = async (query)=>{
    if (!supabase || !query.trim()) return [];
    try {
        // SQL Injection koruması: Özel karakterleri escape et ve uzunluk sınırı koy
        const sanitizedQuery = query.replace(/[%_]/g, '\\$&') // % ve _ karakterlerini escape et (PostgreSQL LIKE için)
        .trim().substring(0, 100) // Maksimum uzunluk sınırı
        ;
        // RLS policy zaten filtreliyor - query'de filtreleme yapmıyoruz
        const { data, error } = await supabase.from('news').select('*').or(`title.ilike.%${sanitizedQuery}%,excerpt.ilike.%${sanitizedQuery}%,content.ilike.%${sanitizedQuery}%`).order('published_at', {
            ascending: false
        }).limit(20);
        if (error) {
            console.error('❌ Error searching news:', {
                code: error.code,
                message: error.message,
                details: error.details
            });
            return [];
        }
        return data || [];
    } catch (err) {
        // Sessizce boş array döndür
        return [];
    }
};
}),
"[project]/src/app/category/[category]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Category page
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$NewsCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/NewsCard.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-rsc] (ecmascript)");
;
;
;
const revalidate = 60;
const CategoryPage = async ({ params })=>{
    const { category } = await params;
    // Get news from Supabase with error handling
    let categoryNews = [];
    try {
        categoryNews = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNewsByCategory"])(category) || [];
    } catch (error) {
        categoryNews = [];
    }
    // Decode category name for display
    const categoryDisplayName = decodeURIComponent(category);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl font-bold text-primary mb-8 capitalize",
                    children: [
                        categoryDisplayName,
                        " Haberleri"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/category/[category]/page.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                categoryNews.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-gray-600 mb-4",
                            children: "Henüz Haber Yok"
                        }, void 0, false, {
                            fileName: "[project]/src/app/category/[category]/page.tsx",
                            lineNumber: 37,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 mb-8",
                            children: "Bu kategoride henüz haber yayınlanmamış."
                        }, void 0, false, {
                            fileName: "[project]/src/app/category/[category]/page.tsx",
                            lineNumber: 38,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/admin/news/new",
                            className: "bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition",
                            children: "İlk Haberi Ekle"
                        }, void 0, false, {
                            fileName: "[project]/src/app/category/[category]/page.tsx",
                            lineNumber: 39,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/category/[category]/page.tsx",
                    lineNumber: 36,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                    children: categoryNews.map((news)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$NewsCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            title: news?.title || 'Haber Başlığı',
                            category: news?.category || 'Gündem',
                            publishedAt: news?.published_at ? new Date(news.published_at).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR'),
                            imageUrl: news?.image_url || 'https://picsum.photos/400/300?random=1',
                            slug: news?.slug,
                            excerpt: news?.excerpt
                        }, news?.id || Math.random(), false, {
                            fileName: "[project]/src/app/category/[category]/page.tsx",
                            lineNumber: 46,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/src/app/category/[category]/page.tsx",
                    lineNumber: 44,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/category/[category]/page.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/category/[category]/page.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CategoryPage;
}),
"[project]/src/app/category/[category]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/category/[category]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d396e090._.js.map