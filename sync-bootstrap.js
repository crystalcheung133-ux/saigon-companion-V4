/* sync-bootstrap.js - Stage D registration-only integration. Sync remains disabled. */
import { TravelSyncEngine } from './sync-core/index.js';
import { createBookingSyncAdapter } from './booking-sync-adapter.js';

class DisabledSyncProvider {
  async connect(){throw new Error('SYNC_FEATURE_DISABLED');}
  async disconnect(){}
  async fetchChanges(){return [];}
  async pushMutation(){return {ok:false,code:'sync-disabled'};}
  async subscribe(){return ()=>{};}
  async getTripGeneration(){return Number(globalThis.TRIP_CONFIG?.tripGeneration||1);}
  async ping(){return false;}
}

function initialiseStageD(){
  const config=globalThis.TRIP_CONFIG;
  const repository=globalThis.CCMV_BOOKING_REPOSITORY;
  const status={
    build:config?.buildLabel||'VN Stage D · Booking Adapter',
    coreLoaded:true,
    adapterRegistered:false,
    syncEnabled:Boolean(config?.features?.bookingSupabaseSync),
    started:false,
    error:null
  };
  try{
    if(!repository)throw new Error('BOOKING_REPOSITORY_UNAVAILABLE');
    const adapter=createBookingSyncAdapter(repository);
    const engine=new TravelSyncEngine({provider:new DisabledSyncProvider()});
    engine.registerDomain(adapter);
    status.adapterRegistered=true;
    globalThis.CCMV_TRAVEL_SYNC_ENGINE=engine;
    globalThis.CCMV_BOOKING_SYNC_ADAPTER=adapter;
    // Stage D acceptance rule: integration is registered, but network sync is not started.
    if(status.syncEnabled)throw new Error('STAGE_D_REQUIRES_SYNC_FEATURE_OFF');
  }catch(error){
    status.error=error?.message||String(error);
    console.error('[CCMV Stage D]',error);
  }
  globalThis.CCMV_SYNC_STAGE_D=Object.freeze(status);
  globalThis.dispatchEvent?.(new CustomEvent('ccmv:sync-stage-d-ready',{detail:status}));
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialiseStageD,{once:true});
else initialiseStageD();
