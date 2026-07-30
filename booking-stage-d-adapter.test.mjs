import test from 'node:test';
import assert from 'node:assert/strict';
import { createBookingSyncAdapter } from './booking-sync-adapter.mjs';
import { TravelSyncEngine } from './sync-core/sync-core.js';

class Repo {
  constructor(row){ this.row=structuredClone(row); }
  async getAll(){ return [structuredClone(this.row)]; }
  async getById(){ return structuredClone(this.row); }
  async applyRemoteWrite(row){ this.row=structuredClone(row); }
  async applyRemoteDelete(id,tombstone){ this.row={...this.row,...tombstone,bookingId:id}; }
  subscribe(){ return ()=>{}; }
}
class DisabledProvider {
  async connect(){}
  async disconnect(){}
  async fetchChanges(){return []}
  async pushMutation(){return {ok:false,code:'disabled'}}
  async subscribe(){return ()=>{}}
  async getTripGeneration(){return 1}
  async ping(){return false}
}
const base={bookingId:'bk-1',id:'bk-1',tripId:'ccmv-vietnam-2026',schemaVersion:1,tripGeneration:1,version:2,title:'Test'};
const config={id:'ccmv-vietnam-2026'};

test('booking adapter registers with certified Sync Core',()=>{
  const repo=new Repo(base); const adapter=createBookingSyncAdapter({repository:repo,tripConfig:config});
  const engine=new TravelSyncEngine({provider:new DisabledProvider()});
  assert.doesNotThrow(()=>engine.registerDomain(adapter));
});

test('booking adapter maps local and remote without persistence access',()=>{
  const repo=new Repo(base); const adapter=createBookingSyncAdapter({repository:repo,tripConfig:config});
  const remote=adapter.toRemote(base);
  assert.equal(remote.recordId,'bk-1');
  const local=adapter.fromRemote(remote);
  assert.equal(local.bookingId,'bk-1');
  assert.equal(local.id,'bk-1');
  assert.equal(adapter.validateLocal(local).ok,true);
});

test('booking adapter rejects wrong trip and schema',()=>{
  const repo=new Repo(base); const adapter=createBookingSyncAdapter({repository:repo,tripConfig:config});
  assert.equal(adapter.validateRemote({...base,tripId:'other'}).ok,false);
  assert.equal(adapter.validateRemote({...base,schemaVersion:2}).ok,false);
});
