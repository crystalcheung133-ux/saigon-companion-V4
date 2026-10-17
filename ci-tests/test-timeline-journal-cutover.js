'use strict';
const assert=require('node:assert/strict');
const {createTimelineJournal}=require('../timeline-sync-journal');
const {createTripTimelineJournal}=require('../timeline-trip-journal');
const {inspectLegacyTimelineJournal}=require('../timeline-journal-migration');
Object.assign(global,{createTimelineJournal,createTripTimelineJournal,inspectLegacyTimelineJournal});
const {prepareTimelineJournalCutover}=require('../timeline-journal-cutover');
function storage(){const m=new Map();return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,v),dump:()=>[...m]};}
const s=storage();
assert.throws(()=>prepareTimelineJournalCutover(s,{tripId:'tripA'}),/confirmed/);
assert.equal(prepareTimelineJournalCutover(s,{tripId:'tripA',confirmedTripId:'tripA'}).ready,true);
createTimelineJournal(s).enqueue({day:'4',items:[{notes:'manual'}]});
const before=JSON.stringify(s.dump());
assert.equal(prepareTimelineJournalCutover(s,{tripId:'tripA',confirmedTripId:'tripA'}).code,'LEGACY_PENDING_REQUIRES_RECONCILIATION');
assert.equal(JSON.stringify(s.dump()),before);
const t=storage();createTripTimelineJournal(t,{tripId:'tripA'}).enqueue({day:'4',items:[]});
assert.equal(prepareTimelineJournalCutover(t,{tripId:'tripA',confirmedTripId:'tripA'}).code,'SCOPED_PENDING_REQUIRES_RECONCILIATION');
assert.throws(()=>prepareTimelineJournalCutover({getItem(){throw Error('fail')},setItem(){}},{tripId:'tripA',confirmedTripId:'tripA'}),/unreadable/);
console.log('Gate32 cutover gate: PASS');
