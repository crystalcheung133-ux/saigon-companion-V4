/* booking-repository.js - authoritative local Booking repository (VN Supabase Stage 1A). */
(function(root){
  'use strict';

  const TRIP_ID=(root.TRIP_CONFIG&&root.TRIP_CONFIG.id)||'ccmv-vietnam-2026';
  const TRIP_GENERATION=Number((root.TRIP_CONFIG&&root.TRIP_CONFIG.tripGeneration)||1);
  const KEY=(root.STORAGE_CONFIG&&root.STORAGE_CONFIG.keys.bookings)||'ccmv_vietnam_bookings_v1';
  const EVENT_NAME='ccmv:bookings-changed';
  const SCHEMA_VERSION=1;
  const MIGRATION_KEY=(root.STORAGE_CONFIG&&root.STORAGE_CONFIG.keys.bookingSchemaMigration)||'ccmv-vietnam-2026:booking_schema_migration:stage_c:v1';
  const MIGRATION_ID='vn-booking-stage-c-v1';
  let remoteProvider=null;

  const SEEDS=Object.freeze([
    {bookingId:'bk-omakase-tiger',eventId:'omakase-tiger',day:1,placeId:'omakase-tiger',category:'Restaurant',title:'Omakase Tiger',date:'2026-10-30',time:'17:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Reservation time: 17:30. Exact reservation URL should be manually verified before payment.',bookingMethod:'WhatsApp / Zalo and official website',bookingContact:'+84 93 201 4124',bookingUrl:'https://omakasetiger.com/en'},
    {bookingId:'bk-nha-suga',eventId:'nha-suga',day:1,placeId:'nha-suga',category:'Spa',title:'Spa Nhà Suga Premium Korea Headspa — Nguyễn Huệ',date:'2026-10-30',time:'14:00',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Address: 8th Floor, 42 Nguyễn Huệ, Bến Nghé, District 1, Ho Chi Minh City\nHours: daily 09:00–20:00\nConfirm treatment duration and arrival time.',bookingMethod:'WhatsApp / Zalo',bookingContact:'+84 903 888 369',bookingUrl:''},
    {bookingId:'bk-lune',eventId:'lune',day:2,placeId:'lune',category:'Restaurant',title:'LÜNE Restaurant & Bar',date:'2026-10-31',time:'19:00',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Phone: +84 28 7777 2022\nEmail: contact-lune@hdnt.vn\nConfirm dinner reservation for 4 guests.',bookingMethod:'Official online reservation',bookingContact:'+84 28 7777 2022',bookingUrl:'https://www.adrienguenzi.com/reservations'},
    {bookingId:'bk-cooking',eventId:'cooking',day:2,placeId:'cooking',category:'Activity',title:'Saigon Cooking Class',date:'2026-10-31',time:'10:00',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Time: 10:00–13:00\nAddress: 80/1 Nguyễn Trãi, Bến Thành, Hồ Chí Minh 770000, Vietnam\nOnline platform: Klook / booking platform to confirm.',bookingMethod:'Online platform',bookingContact:'',bookingUrl:''},
    {bookingId:'bk-moc-kim',eventId:'moc-kim',day:2,placeId:'moc-kim',category:'Spa',title:'Mộc Kim Spa & Beauty — Bến Thành',date:'2026-10-31',time:'',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Branch: 143 Lê Thị Hồng Gấm\nWhatsApp: +84 934 193 758\nHotline: +84 968 459 618',bookingMethod:'Official website / form and WhatsApp',bookingContact:'+84 934 193 758',secondaryContact:'+84 968 459 618',bookingUrl:'https://duongsinhspa.vn/en/all-services/'},
    {bookingId:'bk-little-bear',eventId:'little-bear',day:3,placeId:'little-bear',category:'Restaurant',title:'Little Bear',date:'2026-11-01',time:'18:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Restaurant number retained from the verified source record.',bookingMethod:'WhatsApp or Zalo',bookingContact:'+84 862 512 086',bookingUrl:''},
    {bookingId:'bk-moc-huong',eventId:'moc-huong',day:3,placeId:'moc-huong',category:'Spa',title:'Mộc Hương Wellness — Thảo Điền',date:'2026-11-01',time:'15:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Official booking system. Book at least 36 hours ahead.',bookingMethod:'Online booking / Hotline / Zalo / WhatsApp',bookingContact:'+84 90 975 5877',bookingUrl:'https://mochuongwellness.vn/vi/booking/'},
    {bookingId:'bk-pizza4ps',eventId:'pizza4ps',day:4,placeId:'pizza4ps',category:'Restaurant',title:'Pizza 4P’s Hai Bà Trưng',date:'2026-11-02',time:'11:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Branch: Hai Bà Trưng. Reserve lunch for 4 guests.',bookingMethod:'Official TableCheck reservation',bookingContact:'',bookingUrl:'https://www.tablecheck.com/vi/pizza-4ps-hcm-hai-ba-trung/reserve/landing'},
    {bookingId:'bk-quince',eventId:'quince',day:4,placeId:'quince',category:'Restaurant',title:'Quince Saigon',date:'2026-11-02',time:'19:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Phone: +84 28 3821 8661\nEmail: eat@quincesaigon.com\nConfirm Monday dinner service.',bookingMethod:'Official Book a Table page',bookingContact:'+84 28 3821 8661',bookingUrl:'https://www.quincesaigon.com/reservations'},
    {bookingId:'bk-tinh-thuc',eventId:'tinh-thuc',day:4,placeId:'tinh-thuc',category:'Spa',title:'Tỉnh Thức Spa',date:'2026-11-02',time:'15:15',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Confirm Monday appointment and treatment.',bookingMethod:'WhatsApp / Zalo / Hotline',bookingContact:'+84 989 611 854',bookingUrl:'https://tinhthucspa.com/'},
    {bookingId:'bk-ha-spa',eventId:'ha-spa',day:5,placeId:'ha-spa',category:'Spa',title:'Hạ Spa — Tân Bình',date:'2026-11-03',time:'15:30',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Confirm timing against airport transfer.',bookingMethod:'WhatsApp / Hotline / Zalo',bookingContact:'+84 908 661 683',bookingUrl:''},
    {bookingId:'bk-transfer-in',eventId:'airport-transfer',day:1,placeId:null,category:'Transport',title:'Airport transfer · Arrival',date:'2026-10-30',time:'06:00',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Klook transfer · SGN → Fusion Original.',bookingMethod:'Provider already stored',bookingContact:'',bookingUrl:''},
    {bookingId:'bk-transfer-out',eventId:'airport-transfer-final',day:5,placeId:null,category:'Transport',title:'Airport transfer · Departure',date:'2026-11-03',time:'17:45',status:'pending',bookingName:'',depositPaid:false,depositAmount:'',notes:'Provider: To confirm\nFusion Original / Hạ Spa → SGN.',bookingMethod:'Provider: To confirm',bookingContact:'',bookingUrl:''}
  ]);

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function now(){return new Date().toISOString();}
  function oldDayToDate(day){const s=String(day||'');if(/30 Oct/.test(s))return'2026-10-30';if(/31 Oct/.test(s))return'2026-10-31';if(/1 Nov/.test(s))return'2026-11-01';if(/2 Nov/.test(s))return'2026-11-02';if(/3 Nov/.test(s))return'2026-11-03';return'';}
  function partyId(value){
    const raw=String(value||'').trim();
    if(!raw)return '';
    if(raw.startsWith('party-'))return raw;
    const parties=root.TRIP_CONFIG&&root.TRIP_CONFIG.parties&&root.TRIP_CONFIG.parties.identities;
    if(parties){for(const entry of Object.values(parties)){if((entry.legacyAliases||[]).includes(raw))return entry.partyId;}}
    return `party-${raw}`;
  }
  function seedById(id){return SEEDS.find(row=>row.bookingId===id);}
  function normalise(input, options={}){
    const source=input&&typeof input==='object'?input:{};
    const bookingId=String(source.bookingId||source.id||options.bookingId||'').trim();
    if(!bookingId)throw new Error('Booking record requires bookingId');
    const seed=seedById(bookingId)||{};
    const createdAt=String(source.createdAt||source.updatedAt||options.createdAt||now());
    const updatedAt=String(source.updatedAt||createdAt);
    const record={
      ...clone(seed),
      ...clone(source),
      bookingId,
      id:bookingId,
      tripId:String(source.tripId||TRIP_ID),
      schemaVersion:SCHEMA_VERSION,
      tripGeneration:Number(source.tripGeneration||TRIP_GENERATION),
      version:Math.max(1,Number(source.version)||1),
      eventId:source.eventId===null?null:String(source.eventId||seed.eventId||''),
      placeId:source.placeId===null?null:String(source.placeId||seed.placeId||''),
      day:Number(source.day||seed.day||0),
      date:String(source.date||oldDayToDate(source.day)||seed.date||''),
      time:String(source.time||seed.time||''),
      status:['pending','confirmed','cancelled'].includes(source.status)?source.status:(seed.status||'pending'),
      category:source.category==='Transfer'?'Transport':String(source.category||seed.category||''),
      title:String(source.title||seed.title||''),
      bookingName:String(source.bookingName||''),
      depositPaid:source.depositPaid==null?Boolean(source.deposit):Boolean(source.depositPaid),
      depositAmount:String(source.depositAmount||source.deposit||''),
      notes:String(source.notes||[source.confirmation,source.contact,source.deadline].filter(Boolean).join('\n')||seed.notes||''),
      bookingMethod:String(source.bookingMethod||seed.bookingMethod||''),
      bookingContact:String(source.bookingContact||seed.bookingContact||''),
      secondaryContact:String(source.secondaryContact||seed.secondaryContact||''),
      bookingUrl:String(source.bookingUrl||seed.bookingUrl||''),
      createdAt,
      updatedAt,
      updatedByPartyId:partyId(source.updatedByPartyId||source.updatedBy),
      updatedByUserId:source.updatedByUserId?String(source.updatedByUserId):'',
      deletedAt:source.deletedAt?String(source.deletedAt):''
    };
    delete record.confirmation;delete record.contact;delete record.deadline;delete record.deposit;delete record.updatedBy;
    return record;
  }
  function validateRecord(record){
    const errors=[];
    if(!record||typeof record!=='object')errors.push('record-not-object');
    if(!String(record&&record.bookingId||'').trim())errors.push('missing-bookingId');
    if(String(record&&record.tripId||'')!==TRIP_ID)errors.push('wrong-tripId');
    if(Number(record&&record.schemaVersion)!==SCHEMA_VERSION)errors.push('wrong-schemaVersion');
    if(Number(record&&record.tripGeneration)!==TRIP_GENERATION)errors.push('wrong-tripGeneration');
    if(!Number.isInteger(Number(record&&record.version))||Number(record.version)<1)errors.push('invalid-version');
    if(!String(record&&record.createdAt||'').trim())errors.push('missing-createdAt');
    if(!String(record&&record.updatedAt||'').trim())errors.push('missing-updatedAt');
    if(!['pending','confirmed','cancelled'].includes(record&&record.status))errors.push('invalid-status');
    return errors;
  }
  function validateRecords(records){
    const errors=[];
    const ids=new Set();
    if(!Array.isArray(records))return {ok:false,errors:['records-not-array']};
    records.forEach((record,index)=>{
      const rowErrors=validateRecord(record);
      if(ids.has(record.bookingId))rowErrors.push('duplicate-bookingId');
      ids.add(record.bookingId);
      rowErrors.forEach(error=>errors.push({index,bookingId:record.bookingId||'',error}));
    });
    return {ok:errors.length===0,errors};
  }
  function fingerprint(records){
    return records.map(record=>[record.bookingId,record.tripId,record.schemaVersion,record.tripGeneration,record.version,record.updatedAt].join('|')).sort().join('||');
  }
  function readMigrationMarker(){return root.STORAGE.local.readJSON(MIGRATION_KEY,null);}
  function writeMigrationMarker(records){
    const marker={migrationId:MIGRATION_ID,status:'completed',tripId:TRIP_ID,schemaVersion:SCHEMA_VERSION,tripGeneration:TRIP_GENERATION,recordCount:records.length,fingerprint:fingerprint(records),completedAt:now()};
    if(!root.STORAGE.local.writeJSON(MIGRATION_KEY,marker))throw new Error('Unable to persist Booking migration marker');
    return clone(marker);
  }
  function migrationStatus(){
    const marker=readMigrationMarker();
    const raw=readRaw();
    const validation=validateRecords(Array.isArray(raw)?raw:[]);
    const currentFingerprint=validation.ok?fingerprint(raw):'';
    return Object.freeze({
      migrationId:MIGRATION_ID,
      completed:Boolean(marker&&marker.status==='completed'&&marker.tripId===TRIP_ID&&marker.tripGeneration===TRIP_GENERATION&&marker.schemaVersion===SCHEMA_VERSION&&marker.fingerprint===currentFingerprint),
      marker:marker?clone(marker):null,
      validation
    });
  }
  function readRaw(){return root.STORAGE.local.readJSON(KEY,null);}
  function write(records, emit=true){
    const normalised=records.map(row=>normalise(row));
    if(!root.STORAGE.local.writeJSON(KEY,normalised))throw new Error('Unable to persist Booking records');
    if(emit&&root.dispatchEvent)root.dispatchEvent(new CustomEvent(EVENT_NAME,{detail:{key:KEY}}));
    return clone(normalised);
  }
  function migrate(){
    const raw=readRaw();
    const initial=Array.isArray(raw)?raw:[];
    const marker=readMigrationMarker();
    if(marker&&marker.status==='completed'){
      const currentValidation=validateRecords(initial);
      if(currentValidation.ok&&marker.tripId===TRIP_ID&&marker.tripGeneration===TRIP_GENERATION&&marker.schemaVersion===SCHEMA_VERSION&&marker.fingerprint===fingerprint(initial))return clone(initial);
    }
    const byId=new Map();
    const migrationErrors=[];
    initial.forEach((row,index)=>{
      try{
        const record=normalise(row);
        if(byId.has(record.bookingId))migrationErrors.push({index,bookingId:record.bookingId,error:'duplicate-bookingId'});
        else byId.set(record.bookingId,record);
      }catch(error){migrationErrors.push({index,bookingId:String(row&&row.bookingId||row&&row.id||''),error:error.message||String(error)});}
    });
    if(migrationErrors.length){
      const failure=new Error('BOOKING_SCHEMA_MIGRATION_ABORTED');
      failure.details=migrationErrors;
      throw failure;
    }
    SEEDS.forEach(seed=>{if(!byId.has(seed.bookingId))byId.set(seed.bookingId,normalise(seed));});
    const records=Array.from(byId.values());
    const validation=validateRecords(records);
    if(!validation.ok){
      const failure=new Error('BOOKING_SCHEMA_VALIDATION_FAILED');
      failure.details=validation.errors;
      throw failure;
    }
    const before=JSON.stringify(raw);
    const after=JSON.stringify(records);
    if(before!==after)write(records,false);
    writeMigrationMarker(records);
    return clone(records);
  }
  function list(options={}){
    let rows=migrate();
    if(!options.includeDeleted)rows=rows.filter(row=>!row.deletedAt);
    if(options.category)rows=rows.filter(row=>row.category===options.category);
    if(options.placeId!==undefined)rows=rows.filter(row=>row.placeId===options.placeId);
    return rows;
  }
  function getById(id){return list({includeDeleted:true}).find(row=>row.bookingId===id)||null;}
  function update(id, patch, context={}){
    const rows=list({includeDeleted:true});
    const index=rows.findIndex(row=>row.bookingId===id);
    if(index<0)throw new Error(`Unknown booking: ${id}`);
    const current=rows[index];
    if(context.expectedVersion!=null&&Number(context.expectedVersion)!==Number(current.version))throw new Error('BOOKING_VERSION_CONFLICT');
    rows[index]=normalise({...current,...patch,bookingId:id,version:current.version+1,updatedAt:now(),updatedByPartyId:context.updatedByPartyId||patch.updatedByPartyId||current.updatedByPartyId,updatedByUserId:context.updatedByUserId||patch.updatedByUserId||current.updatedByUserId});
    write(rows);
    return clone(rows[index]);
  }
  function replaceAll(records){
    const validation=validateRecords(records.map(row=>normalise(row)));
    if(!validation.ok){const error=new Error('BOOKING_SCHEMA_VALIDATION_FAILED');error.details=validation.errors;throw error;}
    const written=write(records);
    writeMigrationMarker(written);
    return written;
  }
  function applyRemoteWrite(record){
    const incoming=normalise(record);
    const rows=list({includeDeleted:true});
    const index=rows.findIndex(row=>row.bookingId===incoming.bookingId);
    if(index>=0)rows[index]=incoming;else rows.push(incoming);
    const written=write(rows);
    writeMigrationMarker(written);
    return clone(incoming);
  }
  function applyRemoteDelete(recordId,tombstone={}){
    const current=getById(recordId);
    if(!current)return null;
    return applyRemoteWrite({...current,deletedAt:tombstone.deletedAt||now(),version:Number(tombstone.version||current.version),updatedAt:tombstone.updatedAt||now(),updatedByPartyId:tombstone.updatedByPartyId||current.updatedByPartyId});
  }
  function subscribe(listener){
    const custom=()=>listener(list());
    const storage=event=>{if(event.key===KEY)listener(list());};
    root.addEventListener(EVENT_NAME,custom);root.addEventListener('storage',storage);
    return()=>{root.removeEventListener(EVENT_NAME,custom);root.removeEventListener('storage',storage);};
  }

  function registerRemoteProvider(provider){
    if(!provider||typeof provider.getStatus!=='function')throw new Error('Invalid Booking remote provider');
    if(remoteProvider&&remoteProvider!==provider)throw new Error('Booking remote provider already registered');
    remoteProvider=provider;
    return remoteProvider.getStatus();
  }
  function getRemoteProvider(){return remoteProvider;}
  function getRemoteStatus(){return remoteProvider?remoteProvider.getStatus():Object.freeze({provider:null,configured:false,authenticated:false,active:false,mode:'local-only'});}

  const repository=Object.freeze({
    key:KEY,
    schemaVersion:SCHEMA_VERSION,
    tripId:TRIP_ID,
    tripGeneration:TRIP_GENERATION,
    migrate,
    list,
    getAll:list,
    getById,
    getForPlace(placeId){return list({placeId});},
    update,
    replaceAll,
    applyRemoteWrite,
    applyRemoteDelete,
    validateAll(){const rows=list({includeDeleted:true});return clone(validateRecords(rows));},
    getMigrationStatus(){return clone(migrationStatus());},
    subscribe,
    registerRemoteProvider,
    getRemoteProvider,
    getRemoteStatus,
    getSeeds(){return clone(SEEDS);}
  });
  root.CCMV_BOOKING_REPOSITORY=repository;
  root.CCMV_BOOKINGS=Object.freeze({getForPlace:placeId=>repository.getForPlace(placeId)});
})(globalThis);
