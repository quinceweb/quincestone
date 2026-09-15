"use server";

import { redirect } from "next/navigation";
import { rpc } from "@/lib/supabase/http";

export type SaveDealState={error?:string};

function text(form:FormData,key:string){const value=form.get(key);return typeof value==="string"?value.trim():"";}

export async function saveDealDraft(_previous:SaveDealState,form:FormData):Promise<SaveDealState>{
  const title=text(form,"title");
  if(!title)return {error:"Add a deal title before saving to Quincestone."};
  const rawValue=text(form,"value").replace(/,/g,"");
  const amount=rawValue?Number(rawValue):null;
  if(amount!==null&&(!Number.isFinite(amount)||amount<0))return {error:"Enter a valid non-negative deal value."};
  const expires=text(form,"expires");
  try{
    const dealId=await rpc<string>("create_deal_draft",{
      p_title:title,
      p_counterparty_name:text(form,"buyer")||null,
      p_currency:text(form,"currency")||"USD",
      p_value_minor:amount===null?null:Math.round(amount*100),
      p_scope:text(form,"scope")||null,
      p_commercial_terms:text(form,"terms")||null,
      p_expires_at:expires?`${expires}T23:59:59Z`:null,
    });
    redirect(`/deals/${dealId}`);
  }catch(error){
    if(error instanceof Error&&error.message==="NEXT_REDIRECT")throw error;
    return {error:error instanceof Error?error.message:"The draft could not be persisted."};
  }
}
