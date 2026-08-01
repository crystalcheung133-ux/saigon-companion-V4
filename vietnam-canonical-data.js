/* vietnam-canonical-data.js - approved Vietnam trip data mapped to the
   canonical CCMV entity graph.

   Stage 2.6: all trip STRUCTURE (which entities exist, their stable IDs,
   day/event/place/booking wiring, category taxonomy, Party/Participant
   membership, and which categories behave as route-first directories) is
   authored directly in this file and does not depend on the shape of any
   legacy table. The only remaining dependency on legacy data is CONTENT
   (prose, times, addresses, hours) which is read exclusively through the
   `legacyContent` object immediately below - the single, explicit,
   swappable seam in this file. A second trip can reuse every function and
   pattern below unchanged by supplying its own `legacyContent`-shaped
   object sourced from its own content instead of Vietnam's data.js /
   trip-config.js. */
(function(root){
  'use strict';

  /* ---------------------------------------------------------------------
     Legacy content boundary - the ONLY place in this file that reads
     data.js / trip-config.js globals. Nothing below this block reads
     PLACES / ITINERARY_DATA / TRIP_CONFIG / BOOKINGS_DATA directly.
     --------------------------------------------------------------------- */
  const legacyContent=Object.freeze({
    trip(){ return TRIP_CONFIG; },
    participantName(id){ return TRIP_CONFIG.participants.identities[id].name; },
    place(id){ return PLACES[id]; },
    dayItem(dayNumber,legacyId){
      const day=ITINERARY_DATA[String(dayNumber)];
      const item=day&&day.items.find(value=>value.id===legacyId);
      if(!item)throw new Error(`Vietnam canonical Event source is missing day ${dayNumber} "${legacyId}"`);
      return item;
    },
    day(dayNumber){ return ITINERARY_DATA[String(dayNumber)]; },
    allBookings(){ return Object.values(BOOKINGS_DATA); },
    booking(id){ return BOOKINGS_DATA[id]; }
  });

  const trip=legacyContent.trip();

  const participantIds=['christal','crystal','mero','vivian'];
  const participantEmoji={christal:'🧸',crystal:'👓',mero:'✝️',vivian:'👟'};
  const partyId=id=>`party-${id}`;
  const eventId=(dayNumber,legacyId)=>`event-day${dayNumber}-${legacyId}`;
  const guideId=placeId=>`guide-${placeId}`;
  const categorySlug=category=>String(category).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  const participants=participantIds.map(id=>({
    id,
    displayName:legacyContent.participantName(id),
    presentation:Object.freeze({emoji:participantEmoji[id]})
  }));
  const parties=participantIds.map(id=>({
    id:partyId(id),
    name:legacyContent.participantName(id),
    participantIds:Object.freeze([id]),
    kind:'person',
    presentation:Object.freeze({emoji:participantEmoji[id]})
  }));

  const guidePlaceIds=Object.freeze([
    'fusion','bakes','cong','marou','cafe-apartments','workshop-coffee','running-bean',
    'bep-me-in','late-night-supper','com-tam-moc','little-bear','lune','man-moi','omakase-tiger','pho-sol',
    'pho-vietnam','pizza4ps','quince','quan-thuy','garmentory','dauple','libe',
    'nosbyn','ohquao','push-push','saigon-concept','new-playground','ha-spa',
    'moc-huong','moc-kim','nha-suga','tinh-thuc','fine-arts','book-street',
    'notre-dame','post-office','pink-church','war-museum','cooking','cash-backup',
    'louh','dalla-saigon','rubies','lane-ci'
  ]);
  const categoryMembers=Object.freeze({
    STAY:Object.freeze(['fusion']),
    'CAFÉS':Object.freeze(['bakes','cong','marou','cafe-apartments','workshop-coffee','running-bean']),
    RESTAURANTS:Object.freeze(['bep-me-in','late-night-supper','com-tam-moc','little-bear','lune','man-moi','omakase-tiger','pho-sol','pho-vietnam','pizza4ps','quince','quan-thuy']),
    SHOP:Object.freeze(['garmentory','dauple','libe','nosbyn','ohquao','push-push','saigon-concept','new-playground','louh','dalla-saigon','rubies','lane-ci']),
    SPA:Object.freeze(['ha-spa','moc-huong','moc-kim','nha-suga','tinh-thuc']),
    ATTRACTIONS:Object.freeze(['fine-arts','book-street','notre-dame','post-office','pink-church','war-museum']),
    EXPERIENCE:Object.freeze(['cooking','cash-backup'])
  });

  /* Stage 2.6: which categories behave as a route-first "directory" view
     (Vietnam has exactly one: its Shopping Directory, built from the SHOP
     category). This is trip data, declared once, by category KEY rather
     than by a string literal scattered through runtime code - a second
     trip can list any of its own category keys here (e.g. a "MARKET"
     category) and the same construction logic below builds a matching
     Collection with no other file needing to know the category's name. */
  const routeFirstDirectories=Object.freeze([
    Object.freeze({id:'shopping-directory',title:'Shopping Directory',categoryKey:'SHOP'})
  ]);
  const directoryIdsByCategory=Object.freeze(Object.fromEntries(
    routeFirstDirectories.map(directory=>[directory.categoryKey,directory.id])
  ));

  const places=guidePlaceIds.map(id=>{
    const value=legacyContent.place(id);
    return {
      id,
      name:value.title,
      address:value.address||null,
      mapLinks:Object.freeze(value.maps?[Object.freeze({kind:'googleMaps',url:value.maps})]:[]),
      openingHoursText:value.hours||null,
      placeType:value.cat||null,
      audit:value.audit||null
    };
  });
  places.push({
    id:'tan-son-nhat-airport',
    name:'Tan Son Nhat International Airport',
    address:'Tan Son Nhat International Airport (SGN)',
    mapLinks:Object.freeze([Object.freeze({kind:'googleMaps',url:'https://maps.google.com/?q=Tan+Son+Nhat+International+Airport'})]),
    placeType:'airport'
  });

  const nearbyBeforeOptionMap=Object.freeze({
    'day1:nha-suga':Object.freeze(['workshop-coffee'])
  });
  const mealAlternativeMap=Object.freeze({
    'day1:pho-sol':Object.freeze(['com-tam-moc','pho-vietnam']),
    'day1:omakase-tiger':Object.freeze(['quince','lune']),
    'day2:com-tam-moc':Object.freeze(['pho-sol','pho-vietnam']),
    'day2:lune':Object.freeze(['quince','little-bear']),
    'day3:quan-thuy':Object.freeze(['pho-sol','com-tam-moc']),
    'day3:little-bear':Object.freeze(['quince','lune']),
    'day4:pizza4ps':Object.freeze(['bep-me-in','com-tam-moc']),
    'day4:quince':Object.freeze(['lune','little-bear']),
    'day5:pho-vietnam':Object.freeze(['pho-sol','com-tam-moc']),
    'day5:bep-me-in':Object.freeze(['man-moi'])
  });
  const eventSpecs=Object.freeze([
    [1,"airport-atm",null,null,[],false],
    [1,"airport-transfer","fusion",null,[],false],
    [1,"cash-backup","cash-backup",null,[],false],
    [1,"pho-sol","pho-sol",null,[],false],
    [1,"post-office","post-office",null,[],false],
    [1,"nha-suga","nha-suga",null,[],false],
    [1,"omakase-tiger","omakase-tiger","omakase-tiger-booking",[],false],
    [1,"cafe-apartments","cafe-apartments",null,[],false],
    [1,"return-hotel","fusion",null,[],false],
    [1,"late-night-supper","late-night-supper",null,[],false],
    [2,"com-tam-moc","com-tam-moc",null,[],false],
    [2,"cooking","cooking","cooking-class-booking",[],false],
    [2,"grab-moc-kim","moc-kim",null,[],false],
    [2,"moc-kim","moc-kim",null,[],false],
    [2,"libe","moc-kim",null,["libe","dauple","nosbyn"],true],
    [2,"grab-lune","lune",null,[],false],
    [2,"lune","lune",null,[],false],
    [2,"late-night-supper","late-night-supper",null,[],false],
    [3,"quan-thuy","quan-thuy",null,[],false],
    [3,"pink-church","pink-church",null,[],false],
    [3,"push-push","push-push",null,[],false],
    [3,"grab-thao-dien","saigon-concept",null,[],false],
    [3,"saigon-concept","saigon-concept",null,["saigon-concept","ohquao"],true],
    [3,"bakes","bakes",null,[],false],
    [3,"ohquao","ohquao",null,[],false],
    [3,"moc-huong","moc-huong",null,[],false],
    [3,"louh","louh",null,[],false],
    [3,"little-bear","little-bear",null,[],false],
    [3,"marou","marou",null,[],false],
    [3,"late-night-supper","late-night-supper",null,[],false],
    [4,"running-bean","running-bean",null,[],false],
    [4,"war-museum","war-museum",null,[],false],
    [4,"pizza4ps","pizza4ps",null,[],false],
    [4,"garmentory","garmentory",null,[],true],
    [4,"tinh-thuc","tinh-thuc",null,[],false],
    [4,"shopping-round2","dalla-saigon",null,["dalla-saigon","rubies","lane-ci"],true],
    [4,"grab-quince","quince",null,[],false],
    [4,"quince","quince",null,[],false],
    [4,"social-club",null,null,[],false],
    [4,"late-night-supper","late-night-supper",null,[],false],
    [5,"pho-vietnam","pho-vietnam",null,[],false],
    [5,"fine-arts","fine-arts",null,[],false],
    [5,"bep-me-in","bep-me-in",null,[],false],
    [5,"takashimaya",null,null,[],false],
    [5,"hotel-luggage","fusion",null,[],false],
    [5,"grab-ha-spa","ha-spa",null,[],false],
    [5,"ha-spa","ha-spa",null,[],false],
    [5,"airport-transfer-final",null,null,[],false],
    [5,"airport",null,null,[],false]
  ]);
  const eventRows=[];
  eventSpecs.forEach(([dayNumber,legacyId,placeId,bookingId,guidePlaceIdsForCard,showShoppingDirectory],index)=>{
      const item=legacyContent.dayItem(dayNumber,legacyId);
      const day=legacyContent.day(dayNumber);
      const dayOrder=day.items.indexOf(item);
      eventRows.push({
        id:eventId(dayNumber,legacyId),
        title:item.title,
        date:trip.startDate && new Date(`${trip.startDate}T00:00:00Z`)
          ? new Date(Date.parse(`${trip.startDate}T00:00:00Z`)+(Number(dayNumber)-1)*86400000).toISOString().slice(0,10)
          : null,
        timeText:item.time,
        placeId:placeId||null,
        eventType:item.type||null,
        notes:Object.freeze((item.details||[]).slice()),
        routeToNext:item.route||null,
        bookingIds:Object.freeze(bookingId?[bookingId]:[]),
        partyIds:Object.freeze(participantIds.map(partyId)),
        participantIds:Object.freeze(participantIds.slice()),
        presentation:Object.freeze({
          legacyId,
          dayNumber:Number(dayNumber),
          dayId:`day${dayNumber}`,
          order:dayOrder,
          map:item.map,
          guidePlaceIds:Object.freeze(guidePlaceIdsForCard.slice()),
          showShoppingDirectory,
          nearbyBeforePlaceIds:nearbyBeforeOptionMap[`day${dayNumber}:${legacyId}`]||Object.freeze([]),
          alternativePlaceIds:mealAlternativeMap[`day${dayNumber}:${legacyId}`]||Object.freeze([])
        })
      });
  });

  const eventByLegacy=new Map(eventRows.map(event=>[`${event.presentation.dayId}:${event.presentation.legacyId}`,event.id]));
  const extraGuideEventLinks=Object.freeze({
    'notre-dame':Object.freeze([['day1','post-office']]),
    'book-street':Object.freeze([['day1','post-office']]),
    cong:Object.freeze([['day3','pink-church']]),
    dauple:Object.freeze([['day2','libe']]),
    nosbyn:Object.freeze([['day2','libe']]),
    'new-playground':Object.freeze([['day2','libe']]),
    marou:Object.freeze([['day5','takashimaya']]),
    'man-moi':Object.freeze([['day5','bep-me-in']]),
    'workshop-coffee':Object.freeze([['day1','nha-suga']]),
    'cash-backup':Object.freeze([['day1','cash-backup']]),
    'late-night-supper':Object.freeze([['day1','late-night-supper'],['day2','late-night-supper'],['day3','late-night-supper'],['day4','late-night-supper']])
  });
  const guideEntries=guidePlaceIds.map(placeId=>{
    const value=legacyContent.place(placeId);
    const direct=eventRows.filter(event=>event.placeId===placeId&&event.eventType!=='buffer').map(event=>event.id);
    const extras=(extraGuideEventLinks[placeId]||[]).map(([dayId,legacyId])=>eventByLegacy.get(`${dayId}:${legacyId}`)).filter(Boolean);
    const relatedEventIds=[...new Set([...direct,...extras])];
    return {
      id:guideId(placeId),
      sourceRef:Object.freeze({type:'Place',id:placeId}),
      title:value.title,
      categoryId:value.cat,
      subtitle:value.sub||'',
      description:value.desc||'',
      highlights:Object.freeze((value.signature||value.highlights||[]).slice()),
      goodToKnow:Object.freeze((value.worth||value.tips||[]).slice()),
      priceText:value.price||null,
      hoursText:value.hours||null,
      relatedEventIds:Object.freeze([...new Set(relatedEventIds)]),
      relatedCollectionIds:Object.freeze([
        'guide-all',
        `guide-category-${categorySlug(value.cat)}`,
        ...(directoryIdsByCategory[value.cat]?[directoryIdsByCategory[value.cat]]:[])
      ]),
      presentation:Object.freeze({
        legacyPlaceId:placeId,
        emoji:value.emoji,
        categoryLabel:value.categoryLabel||value.cat||'Guide',
        transport:value.transport||null,
        audit:value.audit||null
      })
    };
  });

  const collections=[{
    id:'guide-all',
    title:'Guide',
    collectionType:'guideOrder',
    items:Object.freeze(guidePlaceIds.map(id=>Object.freeze({ref:Object.freeze({type:'GuideEntry',id:guideId(id)})})))
  }];
  Object.entries(categoryMembers).forEach(([category,items])=>{
    collections.push({
      id:`guide-category-${categorySlug(category)}`,
      title:category,
      collectionType:'guideCategory',
      items:Object.freeze(items.map(placeId=>Object.freeze({ref:Object.freeze({type:'GuideEntry',id:guideId(placeId)})})))
    });
  });
  routeFirstDirectories.forEach(directory=>{
    collections.push({
      id:directory.id,
      title:directory.title,
      collectionType:'routeFirstDirectory',
      items:Object.freeze((categoryMembers[directory.categoryKey]||[]).map(placeId=>Object.freeze({ref:Object.freeze({type:'GuideEntry',id:guideId(placeId)})})))
    });
  });

  const bookingEventMap={
    'omakase-tiger-booking':'event-day1-omakase-tiger',
    'cooking-class-booking':'event-day2-cooking'
  };
  const bookingTargetMap={
    'omakase-tiger-booking':'omakase-tiger',
    'cooking-class-booking':'cooking',
    'airport-transfer-booking':'tan-son-nhat-airport'
  };
  const bookings=legacyContent.allBookings().map(value=>({
    id:value.id,
    bookingType:value.type,
    status:value.status,
    targetRef:Object.freeze({
      type:'Place',
      id:bookingTargetMap[value.id]
    }),
    eventId:bookingEventMap[value.id]||null,
    partyIds:Object.freeze(participantIds.map(partyId)),
    participantIds:Object.freeze(participantIds.slice()),
    reference:value.reference,
    provider:value.contact,
    start:value.date&&value.time?`${value.date} ${value.time}`:value.date,
    paymentStatus:value.paymentStatus,
    notes:value.notes,
    reminders:Object.freeze((value.reminders||[]).slice()),
    addressSnapshot:value.address,
    presentation:Object.freeze({
      legacyDayId:value.dayId,
      title:value.title,
      guests:value.guests,
      mapUrl:value.mapUrl,
      attachmentsPlaceholder:Object.freeze((value.attachmentsPlaceholder||[]).slice())
    })
  }));

  const canonicalTrip={
    id:trip.id,
    schemaVersion:1,
    name:trip.name,
    destinationLabel:trip.destination,
    countryCode:'VN',
    startDate:trip.startDate,
    endDate:trip.endDate,
    timezone:'Asia/Ho_Chi_Minh',
    homeCurrency:'AUD',
    tripCurrency:'VND',
    partyIds:Object.freeze(participantIds.map(partyId)),
    participantIds:Object.freeze(participantIds.slice()),
    defaultPartyId:partyId(trip.participants.defaultKey),
    presentationMetadata:Object.freeze({tripType:'friends-trip'})
  };

  const canonical=CCMV_CANONICAL.create({
    trips:[canonicalTrip],
    parties,
    participants,
    places,
    events:eventRows,
    bookings,
    collections,
    guideEntries,
    expenses:[],
    moments:[]
  });

  root.VN_CANONICAL=Object.freeze({
    ...canonical,
    ids:Object.freeze({partyId,eventId,guideId}),
    reconciliation:Object.freeze({
      legacyPlaces:38,
      presentationOnlyPlaces:Object.freeze(['general']),
      canonicalPlaces:places.length,
      canonicalOnlyPlaces:Object.freeze(['tan-son-nhat-airport']),
      events:eventRows.length,
      guideEntries:guideEntries.length,
      bookings:bookings.length,
      collections:collections.length
    })
  });
})(globalThis);
