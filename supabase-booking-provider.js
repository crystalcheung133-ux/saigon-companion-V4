/* supabase-booking-provider.js - inactive-by-default Supabase Booking provider (VN Stage 1B). */
(function(root){
  'use strict';

  const config=root.CCMV_SUPABASE_CONFIG;
  const repository=root.CCMV_BOOKING_REPOSITORY;
  if(!config)throw new Error('CCMV_SUPABASE_CONFIG must load before supabase-booking-provider.js');
  if(!repository)throw new Error('CCMV_BOOKING_REPOSITORY must load before supabase-booking-provider.js');

  let accessToken='';
  let lastError='';
  let lastCheckedAt='';
  const STATUS_EVENT='ccmv:supabase-booking-status';

  function configured(){return Boolean(config.isConfigured&&config.isConfigured());}
  function emit(){
    if(root.dispatchEvent)root.dispatchEvent(new CustomEvent(STATUS_EVENT,{detail:getStatus()}));
  }
  function getStatus(){
    return Object.freeze({
      provider:'supabase',
      configured:configured(),
      authenticated:Boolean(accessToken),
      active:false,
      mode:'foundation-only',
      lastError,
      lastCheckedAt
    });
  }
  function setAccessToken(token){accessToken=String(token||'');lastError='';emit();return getStatus();}
  function clearAccessToken(){return setAccessToken('');}
  function headers(prefer){
    const bearer=accessToken||config.anonKey;
    const result={
      apikey:config.anonKey,
      Authorization:`Bearer ${bearer}`,
      Accept:'application/json',
      'Content-Type':'application/json',
      'Accept-Profile':config.schema,
      'Content-Profile':config.schema
    };
    if(prefer)result.Prefer=prefer;
    return result;
  }
  async function request(path,options={}){
    if(!configured())throw new Error('Supabase Booking provider is not configured');
    const response=await fetch(`${config.url}/rest/v1/${path}`,{
      method:options.method||'GET',
      headers:headers(options.prefer),
      body:options.body===undefined?undefined:JSON.stringify(options.body)
    });
    if(!response.ok){
      const body=await response.text();
      throw new Error(`Supabase ${response.status}: ${body||response.statusText}`);
    }
    if(response.status===204)return null;
    const text=await response.text();
    return text?JSON.parse(text):null;
  }
  function encode(value){return encodeURIComponent(String(value));}
  function toRemote(record){
    return {
      booking_id:record.bookingId,
      trip_id:record.tripId,
      event_id:record.eventId||null,
      place_id:record.placeId||null,
      day_number:record.day||null,
      status:record.status,
      booking_date:record.date||null,
      booking_time:record.time||null,
      booking_name:record.bookingName||'',
      category:record.category||'',
      title:record.title||'',
      deposit_paid:Boolean(record.depositPaid),
      deposit_amount:record.depositAmount||'',
      booking_method:record.bookingMethod||'',
      booking_contact:record.bookingContact||'',
      secondary_contact:record.secondaryContact||'',
      booking_url:record.bookingUrl||'',
      notes:record.notes||'',
      schema_version:Number(record.schemaVersion||1),
      trip_generation:Number(record.tripGeneration||1),
      version:Number(record.version||1),
      created_at:record.createdAt,
      updated_at:record.updatedAt,
      updated_by_party_id:record.updatedByPartyId||null,
      updated_by_user_id:record.updatedByUserId||null,
      deleted_at:record.deletedAt||null
    };
  }
  function fromRemote(row){
    return {
      bookingId:row.booking_id,id:row.booking_id,tripId:row.trip_id,
      eventId:row.event_id,placeId:row.place_id,day:row.day_number,
      status:row.status,date:row.booking_date||'',time:(row.booking_time||'').slice(0,5),
      bookingName:row.booking_name||'',category:row.category||'',title:row.title||'',
      depositPaid:Boolean(row.deposit_paid),depositAmount:row.deposit_amount||'',
      bookingMethod:row.booking_method||'',bookingContact:row.booking_contact||'',
      secondaryContact:row.secondary_contact||'',bookingUrl:row.booking_url||'',notes:row.notes||'',
      schemaVersion:Number(row.schema_version||1),tripGeneration:Number(row.trip_generation||1),
      version:Number(row.version||1),createdAt:row.created_at,updatedAt:row.updated_at,
      updatedByPartyId:row.updated_by_party_id||'',updatedByUserId:row.updated_by_user_id||'',
      deletedAt:row.deleted_at||''
    };
  }
  async function healthCheck(){
    lastCheckedAt=new Date().toISOString();lastError='';
    try{
      if(!configured())return getStatus();
      await request(`${config.tables.trips}?trip_id=eq.${encode(config.tripId)}&select=trip_id,trip_generation&limit=1`);
    }catch(error){lastError=String(error&&error.message||error);}
    emit();return getStatus();
  }
  async function list(){
    const rows=await request(`${config.tables.bookings}?trip_id=eq.${encode(config.tripId)}&select=*&order=day_number.asc,booking_time.asc`);
    return Array.isArray(rows)?rows.map(fromRemote):[];
  }
  async function getById(bookingId){
    const rows=await request(`${config.tables.bookings}?trip_id=eq.${encode(config.tripId)}&booking_id=eq.${encode(bookingId)}&select=*&limit=1`);
    return rows&&rows[0]?fromRemote(rows[0]):null;
  }
  async function upsert(records){
    void records;
    throw new Error('DIRECT_BOOKING_TABLE_WRITES_PROHIBITED_USE_EDGE_FUNCTION');
  }

  const provider=Object.freeze({
    name:'supabase-bookings',mode:'foundation-only',configured,getStatus,setAccessToken,clearAccessToken,
    healthCheck,list,getById,upsert,toRemote,fromRemote
  });
  repository.registerRemoteProvider(provider);
  root.CCMV_SUPABASE_BOOKING_PROVIDER=provider;
})(globalThis);
