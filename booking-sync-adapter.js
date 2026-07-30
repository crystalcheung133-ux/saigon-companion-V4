/* booking-sync-adapter.js - Stage D Booking adapter for the certified Travel Sync Core. */
export const BOOKING_SYNC_DOMAIN = 'booking';

function clone(value){
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function positiveInteger(value){
  const number=Number(value);
  return Number.isInteger(number)&&number>0?number:null;
}

function validateCanonicalBooking(record,{tripId,schemaVersion}={}){
  const errors=[];
  if(!record||typeof record!=='object')return {ok:false,errors:['record-not-object']};
  if(!String(record.bookingId||'').trim())errors.push('missing-bookingId');
  if(tripId&&String(record.tripId||'')!==tripId)errors.push('wrong-tripId');
  if(schemaVersion&&Number(record.schemaVersion)!==schemaVersion)errors.push('wrong-schemaVersion');
  if(!positiveInteger(record.tripGeneration))errors.push('invalid-tripGeneration');
  if(!positiveInteger(record.version))errors.push('invalid-version');
  if(!['pending','confirmed','cancelled'].includes(record.status))errors.push('invalid-status');
  if(!String(record.createdAt||'').trim())errors.push('missing-createdAt');
  if(!String(record.updatedAt||'').trim())errors.push('missing-updatedAt');
  return {ok:errors.length===0,errors};
}

export function createBookingSyncAdapter(repository){
  if(!repository)throw new TypeError('Booking adapter requires repository');
  const adapter={
    domain:BOOKING_SYNC_DOMAIN,
    tripId:String(repository.tripId||''),
    schemaVersion:Number(repository.schemaVersion||0),
    repository,

    toRemote(localRecord){
      const validation=validateCanonicalBooking(localRecord,{tripId:adapter.tripId,schemaVersion:adapter.schemaVersion});
      if(!validation.ok){const error=new Error('BOOKING_ADAPTER_INVALID_LOCAL');error.details=validation.errors;throw error;}
      return clone(localRecord);
    },

    fromRemote(remoteRecord){
      const validation=validateCanonicalBooking(remoteRecord,{tripId:adapter.tripId,schemaVersion:adapter.schemaVersion});
      if(!validation.ok){const error=new Error('BOOKING_ADAPTER_INVALID_REMOTE');error.details=validation.errors;throw error;}
      return clone(remoteRecord);
    },

    getRecordId(record){
      const id=String(record&&record.bookingId||'').trim();
      if(!id)throw new Error('Booking record requires bookingId');
      return id;
    },

    getVersion(record){
      const version=positiveInteger(record&&record.version);
      if(!version)throw new Error('Booking record requires positive version');
      return version;
    },

    getTripGeneration(record){
      const generation=positiveInteger(record&&record.tripGeneration);
      if(!generation)throw new Error('Booking record requires positive tripGeneration');
      return generation;
    },

    validateLocal(record){return validateCanonicalBooking(record,{tripId:adapter.tripId,schemaVersion:adapter.schemaVersion});},
    validateRemote(record){return validateCanonicalBooking(record,{tripId:adapter.tripId,schemaVersion:adapter.schemaVersion});},

    async onGenerationBump(event){
      if(String(event&&event.tripId||'')!==adapter.tripId)return;
      if(Number(event.currentGeneration)!==Number(repository.tripGeneration)){
        repository.applyGenerationBump(event.currentGeneration);
        globalThis.dispatchEvent?.(new CustomEvent('ccmv:booking-generation-mismatch',{detail:clone(event)}));
      }
    }
  };
  return Object.freeze(adapter);
}

export { validateCanonicalBooking };
