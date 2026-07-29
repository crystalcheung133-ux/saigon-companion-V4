/* supabase-config.js - VN Supabase Stage 1B public client configuration. */
(function(root){
  'use strict';

  const supplied=root.CCMV_SUPABASE_CONFIG||{};
  const config={
    enabled:supplied.enabled===undefined?true:Boolean(supplied.enabled),
    url:String(supplied.url||'https://dafgbqygccvctifrevpa.supabase.co'),
    anonKey:String(supplied.anonKey||'sb_publishable_gjObd52pFWZh5VDWD5wKZw_jHxzV7yP'),
    tripAccessToken:String(supplied.tripAccessToken||'ccmv_vn_2026_7LxA9rPqK2mN8VfH5tYwQ3eUzC1JsBdR'),
    schema:String(supplied.schema||'public'),
    tripId:String(supplied.tripId||(root.TRIP_CONFIG&&root.TRIP_CONFIG.id)||'ccmv-vietnam-2026'),
    tables:Object.freeze({
      trips:String((supplied.tables&&supplied.tables.trips)||'trips'),
      parties:String((supplied.tables&&supplied.tables.parties)||'parties'),
      memberships:String((supplied.tables&&supplied.tables.memberships)||'trip_memberships'),
      bookings:String((supplied.tables&&supplied.tables.bookings)||'bookings')
    })
  };

  config.isConfigured=function(){
    return Boolean(config.enabled&&/^https:\/\/.+\.supabase\.co$/i.test(config.url)&&config.anonKey);
  };

  root.CCMV_SUPABASE_CONFIG=Object.freeze(config);
})(globalThis);
