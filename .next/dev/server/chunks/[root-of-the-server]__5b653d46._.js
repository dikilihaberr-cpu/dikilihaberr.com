module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/utils/logger.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logger",
    ()=>logger
]);
// Logger utility - Development-only logging
// In production, logs are suppressed for security and performance
const isDevelopment = ("TURBOPACK compile-time value", "development") === 'development';
const logger = {
    log: (...args)=>{
        if ("TURBOPACK compile-time truthy", 1) {
            console.log(...args);
        }
    },
    error: (...args)=>{
        if ("TURBOPACK compile-time truthy", 1) {
            console.error(...args);
        }
    },
    warn: (...args)=>{
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn(...args);
        }
    },
    info: (...args)=>{
        if ("TURBOPACK compile-time truthy", 1) {
            console.info(...args);
        }
    }
};
}),
"[project]/src/app/api/setup-admin/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/logger.ts [app-route] (ecmascript)");
;
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://suhklarwjeedtabcusgz.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aGtsYXJ3amVlZHRhYmN1c2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NDY1NDAsImV4cCI6MjA4NDIyMjU0MH0.Nul4ypXBlBh9Jh-4Cwq87vIUoarVhgOFtAckLcFAnDA");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
async function POST(request) {
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Get auth token from request
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized - No token provided'
            }, {
                status: 401
            });
        }
        const token = authHeader.replace('Bearer ', '');
        // Create client with user's token
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized - Invalid token'
            }, {
                status: 401
            });
        }
        // Try to create admins table if it doesn't exist (using service role if available)
        let tableCreated = false;
        if (supabaseServiceKey) {
            try {
                const serviceClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey, {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false
                    }
                });
                // Create table using RPC or direct SQL (if available)
                // Note: This might not work without proper RPC function
                // Fallback: User needs to create table manually via SQL Editor
                const { error: createError } = await serviceClient.rpc('exec_sql', {
                    sql: `
            CREATE TABLE IF NOT EXISTS public.admins (
              user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
              role TEXT DEFAULT 'admin',
              email TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
            
            DROP POLICY IF EXISTS "Admins can read self" ON public.admins;
            
            CREATE POLICY "Admins can read self" ON public.admins
              FOR SELECT USING (auth.uid() = user_id);
          `
                });
                if (!createError) {
                    tableCreated = true;
                }
            } catch (err) {
                // RPC might not be available, that's okay
                console.log('Could not create table via RPC, user needs to create manually');
            }
        }
        // Check if admins table exists by trying to query it
        const { error: checkError } = await supabase.from('admins').select('user_id').limit(1);
        if (checkError) {
            // Table doesn't exist
            if (checkError.code === '42P01' || checkError.message?.includes('does not exist')) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Admins table does not exist',
                    message: 'Please run SETUP_ADMIN.sql in Supabase SQL Editor first',
                    sqlFile: 'SETUP_ADMIN.sql'
                }, {
                    status: 400
                });
            }
            // RLS infinite recursion error
            if (checkError.message?.includes('infinite recursion') || checkError.message?.includes('recursion detected')) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'RLS infinite recursion detected',
                    message: 'Please run FIX_RLS_RECURSION.sql in Supabase SQL Editor to fix this issue',
                    sqlFile: 'FIX_RLS_RECURSION.sql'
                }, {
                    status: 400
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Database error: ${checkError.message}`
            }, {
                status: 500
            });
        }
        // Add current user as admin
        const { data: adminData, error: insertError } = await supabase.from('admins').insert({
            user_id: user.id,
            email: user.email,
            role: 'admin'
        }).select().single();
        if (insertError) {
            // Might already exist, try to update
            if (insertError.code === '23505') {
                const { data: updateData, error: updateError } = await supabase.from('admins').update({
                    role: 'admin',
                    email: user.email
                }).eq('user_id', user.id).select().single();
                if (updateError) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: `Failed to update admin: ${updateError.message}`
                    }, {
                        status: 500
                    });
                }
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    message: 'Admin status updated successfully',
                    admin: updateData,
                    tableCreated
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Failed to add admin: ${insertError.message}`
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Admin added successfully',
            admin: adminData,
            tableCreated
        });
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].error('Setup admin error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5b653d46._.js.map