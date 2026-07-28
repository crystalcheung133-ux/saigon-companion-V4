/* supabase-config.js - VN Stage 1C trusted Party Selector public client configuration. */
(function(root){
  'use strict';
  const config={
    enabled:true,
    identityMode:'trusted-party-selector',
    url:'https://dafgbqygccvctifrevpa.supabase.co',
    publishableKey:'sb_publishable_gjObd52pFWZh5VDWD5wKZw_jHxzV7yP',
    schema:'public',
    tripId:(root.TRIP_CONFIG&&root.TRIP_CONFIG.id)||'ccmv-vietnam-2026',
    tables:Object.freeze({trips:'trips',parties:'parties',bookings:'bookings'})
  };
  config.isConfigured=function(){return Boolean(config.enabled&&/^https:\/\/.+\.supabase\.co$/i.test(config.url)&&config.publishableKey);};
  root.CCMV_SUPABASE_CONFIG=Object.freeze(config);
})(globalThis);
