/* vietnam-canonical-data.js - approved Vietnam trip data mapped to the
   canonical CCMV entity graph. Frozen prose remains sourced from data.js,
   but all runtime identity and relationships are established here. */
(function(root){
  'use strict';

  const participantIds=['christal','crystal','mero','vivian'];
  const participantEmoji={christal:'🧸',crystal:'👓',mero:'✝️',vivian:'👟'};
  const partyId=id=>`party-${id}`;
  const eventId=(dayNumber,legacyId)=>`event-day${dayNumber}-${legacyId}`;
  const guideId=placeId=>`guide-${placeId}`;
  const categorySlug=category=>String(category).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  const participants=participantIds.map(id=>({
    id,
    displayName:TRIP_CONFIG.participants.identities[id].name,
    presentation:Object.freeze({emoji:participantEmoji[id]})
  }));
  const parties=participantIds.map(id=>({
    id:partyId(id),
    name:TRIP_CONFIG.participants.identities[id].name,
    participantIds:Object.freeze([id]),
    kind:'person',
    presentation:Object.freeze({emoji:participantEmoji[id]})
  }));

  const guidePlaceIds=Object.freeze([
    'fusion','bakes','cong','marou','cafe-apartments','running-bean',
    'bep-me-in','com-tam-moc','little-bear','lune','omakase-tiger','pho-sol',
    'pho-vietnam','pizza4ps','quince','quan-thuy','garmentory','dauple','libe',
    'nosbyn','ohquao','push-push','saigon-concept','new-playground','ha-spa',
    'moc-huong','moc-kim','nha-suga','temple-leaf','fine-arts','book-street',
    'notre-dame','post-office','pink-church','war-museum','cooking'
  ]);
  const categoryMembers=Object.freeze({
    STAY:Object.freeze(['fusion']),
    'CAFÉS':Object.freeze(['bakes','cong','marou','cafe-apartments','running-bean']),
    RESTAURANTS:Object.freeze(['bep-me-in','com-tam-moc','little-bear','lune','omakase-tiger','pho-sol','pho-vietnam','pizza4ps','quince','quan-thuy']),
    SHOP:Object.freeze(['garmentory','dauple','libe','nosbyn','ohquao','push-push','saigon-concept','new-playground']),
    SPA:Object.freeze(['ha-spa','moc-huong','moc-kim','nha-suga','temple-leaf']),
    ATTRACTIONS:Object.freeze(['fine-arts','book-street','notre-dame','post-office','pink-church','war-museum']),
    EXPERIENCE:Object.freeze(['cooking'])
  });
  const places=guidePlaceIds.map(id=>{
    const value=PLACES[id];
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

  const eventSpecs=Object.freeze([
    [1,'fusion','fusion',null,[],false],[1,'pho-sol','pho-sol',null,[],false],
    [1,'post-office','post-office',null,[],false],[1,'nha-suga','nha-suga',null,[],false],
    [1,'omakase-tiger','omakase-tiger','omakase-tiger-booking',[],false],
    [1,'cafe-apartments','cafe-apartments',null,[],false],
    [2,'com-tam-moc','com-tam-moc',null,[],false],
    [2,'cooking','cooking','cooking-class-booking',[],false],
    [2,'moc-kim','moc-kim',null,[],false],
    [2,'libe','libe',null,['libe','dauple','nosbyn'],true],
    [2,'lune','lune',null,[],false],
    [3,'quan-thuy','quan-thuy',null,[],false],[3,'pink-church','pink-church',null,[],false],
    [3,'push-push','push-push',null,[],false],
    [3,'saigon-concept','saigon-concept',null,['saigon-concept','ohquao'],true],
    [3,'bakes','bakes',null,[],false],[3,'ohquao','ohquao',null,[],false],
    [3,'moc-huong','moc-huong',null,[],false],[3,'little-bear','little-bear',null,[],false],
    [3,'marou','marou',null,[],false],
    [4,'running-bean','running-bean',null,[],false],[4,'war-museum','war-museum',null,[],false],
    [4,'pizza4ps','pizza4ps',null,[],false],[4,'garmentory','garmentory',null,[],false],
    [4,'temple-leaf','temple-leaf',null,[],false],[4,'quince','quince',null,[],false],
    [5,'pho-vietnam','pho-vietnam',null,[],false],[5,'fine-arts','fine-arts',null,[],false],
    [5,'bep-me-in','bep-me-in',null,[],false],[5,'takashimaya',null,null,[],false],
    [5,'hotel-luggage','fusion',null,[],false],[5,'ha-spa','ha-spa',null,[],false],
    [5,'airport',null,null,[],false]
  ]);
  const eventRows=[];
  eventSpecs.forEach(([dayNumber,legacyId,placeId,bookingId,guidePlaceIdsForCard,showShoppingDirectory],index)=>{
      const day=ITINERARY_DATA[String(dayNumber)];
      const item=day.items.find(value=>value.id===legacyId);
      if(!item)throw new Error(`Vietnam canonical Event source is missing day ${dayNumber} "${legacyId}"`);
      const dayOrder=day.items.indexOf(item);
      eventRows.push({
        id:eventId(dayNumber,legacyId),
        title:item.title,
        date:TRIP_CONFIG.startDate && new Date(`${TRIP_CONFIG.startDate}T00:00:00Z`)
          ? new Date(Date.parse(`${TRIP_CONFIG.startDate}T00:00:00Z`)+(Number(dayNumber)-1)*86400000).toISOString().slice(0,10)
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
          showShoppingDirectory
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
    marou:Object.freeze([['day5','takashimaya']])
  });
  const guideEntries=guidePlaceIds.map(placeId=>{
    const value=PLACES[placeId];
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
        ...(value.cat==='SHOP'?['shopping-directory']:[])
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
  collections.push({
    id:'shopping-directory',
    title:'Shopping Directory',
    collectionType:'routeFirstDirectory',
    items:Object.freeze(categoryMembers.SHOP.map(placeId=>Object.freeze({ref:Object.freeze({type:'GuideEntry',id:guideId(placeId)})})))
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
  const bookings=Object.values(BOOKINGS_DATA).map(value=>({
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

  const trip={
    id:TRIP_CONFIG.id,
    schemaVersion:1,
    name:TRIP_CONFIG.name,
    destinationLabel:TRIP_CONFIG.destination,
    countryCode:'VN',
    startDate:TRIP_CONFIG.startDate,
    endDate:TRIP_CONFIG.endDate,
    timezone:'Asia/Ho_Chi_Minh',
    homeCurrency:'AUD',
    tripCurrency:'VND',
    partyIds:Object.freeze(participantIds.map(partyId)),
    participantIds:Object.freeze(participantIds.slice()),
    defaultPartyId:partyId(TRIP_CONFIG.participants.defaultKey),
    presentationMetadata:Object.freeze({tripType:'friends-trip'})
  };

  const canonical=CCMV_CANONICAL.create({
    trips:[trip],
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
      legacyPlaces:37,
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
