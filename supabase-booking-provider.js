/* supabase-booking-provider.js - trusted Party Selector Supabase Booking provider (VN Stage 1C). */
(function(root){
  'use strict';
  const config=root.CCMV_SUPABASE_CONFIG;
  const repository=root.CCMV_BOOKING_REPOSITORY;
  if(!config||!repository)throw new Error('Supabase config and Booking repository must load first');
  let client=null,lastError='',lastCheckedAt='';
  const STATUS_EVENT='ccmv:supabase-booking-status';
  function configured(){return Boolean(config.isConfigured&&config.isConfigured()&&root.supabase&&root.supabase.createClient);}
  function getClient(){
    if(!configured())return null;
    if(!client)client=root.supabase.createClient(config.url,config.publishableKey,{db:{schema:config.schema},auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
    return client;
  }
  function emit(extra={}){root.dispatchEvent?.(new CustomEvent(STATUS_EVENT,{detail:{...getStatus(),...extra}}));}
  function getStatus(){return Object.freeze({provider:'supabase',configured:configured(),active:Boolean(client),mode:'trusted-party-selector',lastError,lastCheckedAt});}
  function toRemote(record,partyId){return {
    booking_id:record.bookingId,trip_id:record.tripId,event_id:record.eventId||null,place_id:record.placeId||null,
    day_number:record.day||null,status:record.status,booking_date:record.date||null,booking_time:record.time||null,
    booking_name:record.bookingName||'',category:record.category||'',title:record.title||'',deposit_paid:Boolean(record.depositPaid),
    deposit_amount:record.depositAmount||'',booking_method:record.bookingMethod||'',booking_contact:record.bookingContact||'',
    secondary_contact:record.secondaryContact||'',booking_url:record.bookingUrl||'',notes:record.notes||'',schema_version:Number(record.schemaVersion||1),
    trip_generation:Number(record.tripGeneration||1),version:Number(record.version||1),created_at:record.createdAt,updated_at:record.updatedAt,
    updated_by_party_id:partyId||record.updatedByPartyId||null,updated_by_user_id:null,deleted_at:record.deletedAt||null
  };}
  function fromRemote(row){return {bookingId:row.booking_id,id:row.booking_id,tripId:row.trip_id,eventId:row.event_id,placeId:row.place_id,day:row.day_number,
    status:row.status,date:row.booking_date||'',time:(row.booking_time||'').slice(0,5),bookingName:row.booking_name||'',category:row.category||'',title:row.title||'',
    depositPaid:Boolean(row.deposit_paid),depositAmount:row.deposit_amount||'',bookingMethod:row.booking_method||'',bookingContact:row.booking_contact||'',
    secondaryContact:row.secondary_contact||'',bookingUrl:row.booking_url||'',notes:row.notes||'',schemaVersion:Number(row.schema_version||1),
    tripGeneration:Number(row.trip_generation||1),version:Number(row.version||1),createdAt:row.created_at,updatedAt:row.updated_at,
    updatedByPartyId:row.updated_by_party_id||'',updatedByUserId:'',deletedAt:row.deleted_at||''};}
  async function list(){const c=getClient();if(!c)throw new Error('Supabase client unavailable');const {data,error}=await c.from(config.tables.bookings).select('*').eq('trip_id',config.tripId).order('day_number').order('booking_time');if(error)throw error;return (data||[]).map(fromRemote);}
  async function apply(record,baseVersion,partyId){const c=getClient();if(!c)throw new Error('Supabase client unavailable');const payload=toRemote(record,partyId);const {data,error}=await c.rpc('ccmv_apply_booking_trusted',{booking_payload:payload,expected_version:Number(baseVersion||0)});if(error)throw error;const row=Array.isArray(data)?data[0]:data;return row?fromRemote(row):null;}
  function subscribe(callback){const c=getClient();if(!c)return()=>{};const channel=c.channel(`trusted-bookings:${config.tripId}`).on('postgres_changes',{event:'*',schema:config.schema,table:config.tables.bookings,filter:`trip_id=eq.${config.tripId}`},payload=>{if(payload.new&&payload.new.booking_id)callback(fromRemote(payload.new),payload.eventType);else if(payload.old&&payload.old.booking_id)callback({bookingId:payload.old.booking_id,deletedAt:new Date().toISOString()},payload.eventType);}).subscribe();return()=>c.removeChannel(channel);}
  async function healthCheck(){lastCheckedAt=new Date().toISOString();lastError='';try{const c=getClient();if(!c)return getStatus();const {error}=await c.from(config.tables.trips).select('trip_id').eq('trip_id',config.tripId).limit(1);if(error)throw error;}catch(e){lastError=String(e.message||e);}emit();return getStatus();}
  const provider=Object.freeze({name:'supabase-bookings',mode:'trusted-party-selector',configured,getClient,getStatus,healthCheck,list,apply,subscribe,toRemote,fromRemote});
  repository.registerRemoteProvider(provider);root.CCMV_SUPABASE_BOOKING_PROVIDER=provider;
})(globalThis);
