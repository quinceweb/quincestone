import { cookies } from "next/headers";

function config(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY??process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!url||!key)throw new Error("Deals persistence is not configured.");return {url,key};}
export async function accessToken(){const store=await cookies();for(const cookie of store.getAll()){if(cookie.name.startsWith("sb-")&&cookie.name.endsWith("-auth-token")){try{const parsed=JSON.parse(cookie.value.startsWith("base64-")?Buffer.from(cookie.value.slice(7),"base64").toString():decodeURIComponent(cookie.value));if(Array.isArray(parsed)&&typeof parsed[0]==="string")return parsed[0];}catch{}}}return null;}
export async function rest(path:string){const {url,key}=config();const token=await accessToken();if(!token)throw new Error("Authentication required.");return fetch(`${url}/rest/v1/${path}`,{headers:{apikey:key,Authorization:`Bearer ${token}`},cache:"no-store"});}
