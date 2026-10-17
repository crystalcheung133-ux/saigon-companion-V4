/* Gate32: strictly isolated staging harness; NEVER consumes the live Timeline journal. */
(function(){'use strict';
const STAGING_TRIP='staging-test-20261017';
const STAGING_PARTY='admin-test';
const STAGING_JOURNAL='vn_timeline_staging_only_test_20261017';
const STAGING_META='vn_timeline_staging_only_retry_20261017';
let coordinator=null, journal=null, busy=false;
function enable(config){
 if(!config||config.confirmStaging!==true)throw Error('Explicit staging opt-in required');
 if(coordinator)throw Error('Staging already enabled');
 if(config.tripId!==STAGING_TRIP||config.partyId!==STAGING_PARTY)throw Error('Only isolated fixture trip and party allowed');
 if(typeof config.token!=='string'||!config.token)throw Error('Staging token required');
 if(typeof window.createTimelineJournal!=='function'||typeof window.createStagingClient!=='function'||typeof window.createStagingRetry!=='function')throw Error('Staging dependencies missing');
 const client=window.createStagingClient({fetchImpl:window.fetch.bind(window),tripId:config.tripId,partyId:config.partyId,token:config.token});
 journal=window.createTimelineJournal(window.localStorage,STAGING_JOURNAL);
 // Fail closed on corrupt staging journal before enabling any write.
 journal.read();
 coordinator=window.createStagingRetry({journal,client,storage:window.localStorage,metaKey:STAGING_META});
 coordinator.inspect();
 return {enabled:true,mode:'isolated-fixtures-only'};
}
function enqueueFake(day,items){
 if(!coordinator||!journal)throw Error('Staging not enabled');
 if(!/^test-day-[a-z0-9-]+$/.test(day)||!Array.isArray(items))throw Error('Only fake test-day data allowed');
 return journal.enqueue({day,items});
}
async function retryOne(){
 if(!coordinator)throw Error('Staging not enabled');
 if(busy)throw Error('Retry already running');
 busy=true;
 try{return await coordinator.retryOne();}
 finally{busy=false;}
}
window.TRAVEL_STAGING_TIMELINE=Object.freeze({enable,enqueueFake,retryOne,isEnabled:()=>!!coordinator,inspect:()=>journal?.read()??null});
})();
