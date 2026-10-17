const fs=require('fs'),vm=require('vm'),assert=require('assert');
const storeState={};
const root={
  globalThis:null,
  TRIP_CONFIG:{bookingMasterRevision:8},
  STORAGE_CONFIG:{keys:{bookingOverrides:'test:booking_overrides'}},
  BOOKINGS_DATA:{
    transport:{id:'transport',type:'transport',status:'confirmed',reference:'REF-1'},
    accommodation:{id:'accommodation',type:'accommodation',status:'confirmed',reference:'HOTEL-1'}
  },
  STORAGE:{local:{
    readJSON:(k,fallback)=>Object.prototype.hasOwnProperty.call(storeState,k)?JSON.parse(JSON.stringify(storeState[k])):fallback,
    writeJSON:(k,v)=>(storeState[k]=JSON.parse(JSON.stringify(v)),true),
    remove:(k)=>(delete storeState[k],true)
  }},
  console
};
root.globalThis=root;
vm.createContext(root);
vm.runInContext(fs.readFileSync('booking-authority.js','utf8'),root,{filename:'booking-authority.js'});
function poison(id,revision=7){
  storeState['test:booking_overrides']={
    version:1,deletedIds:[],updatedAt:'test',
    overrides:{[id]:{id,status:'pending',displayStatus:'pending',_masterRevision:revision}}
  };
}
for(const id of ['transport','accommodation']){
  poison(id,7);
  const resolved=root.BOOKING_AUTHORITY.get(id,root.BOOKINGS_DATA);
  assert.equal(resolved.status,'pending',id+': saved user status must survive deploy revision');
  assert.equal(resolved.displayStatus,undefined,id+': stale displayStatus survived canonical status authority');
}
storeState['test:booking_overrides']={version:1,deletedIds:[],overrides:{},updatedAt:null};
const saved=root.BOOKING_AUTHORITY.save('accommodation',{status:'pending',displayStatus:'CONFIRMED'},root.BOOKINGS_DATA,{silent:true});
assert(saved.ok,'current-revision save failed');
assert.equal(saved.booking.status,'pending','current-revision status edit did not persist');
assert.equal(saved.booking._masterRevision,8,'current-revision save not stamped');
assert.equal(saved.booking.displayStatus,undefined,'legacy displayStatus must not remain a second authority');
assert.equal(root.BOOKING_AUTHORITY.get('accommodation',root.BOOKINGS_DATA).status,'pending','current-revision edit not resolved');
const runtime=fs.readFileSync('trip-runtime.js','utf8');
assert(!runtime.includes('booking.displayStatus||bookingStatusText(booking)'),'accommodation UI still prefers displayStatus');
assert(!runtime.includes('booking.displayStatus||bookingStatusText(booking)||'),'accommodation picker still prefers displayStatus');
assert(!runtime.includes('booking.displayStatus||booking.status'),'bookingStatusText still reads displayStatus as authority');
assert(runtime.includes("const statusLabel=bookingStatusText(booking)||'';"),'accommodation picker must derive status from bookingStatusText');
assert(runtime.includes("['Status',bookingStatusText(booking)]"),'accommodation detail must derive status from bookingStatusText');
console.log('BOOKING SINGLE STATUS AUTHORITY: PASS — saved user status persists across revisions and displayStatus remains canonical; current-revision status edits persist.');
