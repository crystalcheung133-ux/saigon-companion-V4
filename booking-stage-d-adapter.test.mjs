import test from 'node:test';
import assert from 'node:assert/strict';
import { TravelSyncEngine } from './sync-core/sync-core.js';
import { SyncTestProvider } from './sync-core/sync-test-provider.js';
import { createBookingSyncAdapter } from './booking-sync-adapter.js';

function record(overrides={}){
  return {bookingId:'bk-test',tripId:'ccmv-vietnam-2026',schemaVersion:1,tripGeneration:1,version:1,status:'pending',createdAt:'2026-07-29T00:00:00.000Z',updatedAt:'2026-07-29T00:00:00.000Z',...overrides};
}
function repository(){
  const rows=new Map([[record().bookingId,record()]]);
  return {tripId:'ccmv-vietnam-2026',schemaVersion:1,tripGeneration:1,
    async getAll(){return [...rows.values()]},async getById(id){return rows.get(id)||null},
    async applyRemoteWrite(row){rows.set(row.bookingId,structuredClone(row));return row},
    async applyRemoteDelete(id,t){const row=rows.get(id);if(row)rows.set(id,{...row,...t,deletedAt:t.deletedAt||new Date().toISOString()})},
    subscribe(){return ()=>{}},_rows:rows};
}

test('Booking adapter registers against certified Sync Core',()=>{
  const repo=repository();
  const adapter=createBookingSyncAdapter(repo);
  const engine=new TravelSyncEngine({provider:new SyncTestProvider()});
  assert.doesNotThrow(()=>engine.registerDomain(adapter));
});

test('Booking adapter round-trips canonical records without mutation',()=>{
  const repo=repository();const adapter=createBookingSyncAdapter(repo);const source=record({notes:'hello'});
  const remote=adapter.toRemote(source);remote.notes='changed';
  assert.equal(source.notes,'hello');
  const local=adapter.fromRemote(adapter.toRemote(source));
  assert.deepEqual(local,source);
});

test('Booking adapter rejects wrong trip, schema, version and generation',()=>{
  const adapter=createBookingSyncAdapter(repository());
  for(const invalid of [record({tripId:'wrong'}),record({schemaVersion:2}),record({version:0}),record({tripGeneration:0})]){
    assert.equal(adapter.validateRemote(invalid).ok,false);
    assert.throws(()=>adapter.fromRemote(invalid));
  }
});

test('Stage D repository seam supports explicit remote write and delete',async()=>{
  const repo=repository();const adapter=createBookingSyncAdapter(repo);
  const incoming=record({version:2,status:'confirmed'});
  await adapter.repository.applyRemoteWrite(adapter.fromRemote(incoming));
  assert.equal((await repo.getById('bk-test')).status,'confirmed');
  await adapter.repository.applyRemoteDelete('bk-test',{deletedAt:'2026-07-29T01:00:00.000Z',version:3});
  assert.equal((await repo.getById('bk-test')).deletedAt,'2026-07-29T01:00:00.000Z');
});
