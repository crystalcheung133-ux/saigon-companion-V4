/* vietnam-presentation-adapter.js - Vietnam-only compatibility projection.
   Converts the canonical graph into the exact Stage 1 view-model shapes.
   Runtime modules consume this adapter; legacy data.js globals are immutable
   source-content inputs and are not runtime relationship authorities. */
(function(root){
  'use strict';
  const model=VN_CANONICAL.model;
  const trip=model.trips['ccmv-vietnam-2026'];
  const categoryCollections=Object.values(model.collections).filter(c=>c.collectionType==='guideCategory');

  function legacyPlace(entry){
    const place=model.places[entry.sourceRef.id];
    const frozen=PLACES[entry.presentation.legacyPlaceId];
    return Object.freeze({
      title:entry.title,
      emoji:entry.presentation.emoji,
      cat:entry.categoryId,
      sub:entry.subtitle,
      hours:entry.hoursText,
      maps:place.mapLinks?.[0]?.url||'',
      address:place.address||'',
      desc:entry.description,
      signature:entry.highlights,
      worth:entry.goodToKnow,
      categoryLabel:entry.presentation.categoryLabel,
      price:entry.priceText,
      transport:entry.presentation.transport,
      audit:entry.presentation.audit,
      highlights:Object.freeze((frozen.highlights||entry.highlights||[]).slice()),
      tips:Object.freeze((frozen.tips||entry.goodToKnow||[]).slice()),
      ...(frozen.website?{website:frozen.website}:{})
    });
  }
  const places=Object.freeze(Object.fromEntries(
    Object.values(model.guideEntries).map(entry=>[entry.presentation.legacyPlaceId,legacyPlace(entry)])
      .concat([['general',Object.freeze({...PLACES.general})]])
  ));
  const guideOrder=Object.freeze(model.collections['guide-all'].items.map(item=>model.guideEntries[item.ref.id].presentation.legacyPlaceId));
  const categories=Object.freeze(Object.fromEntries(categoryCollections.map(collection=>[
    collection.title,
    Object.freeze(collection.items.map(item=>{
      const entry=model.guideEntries[item.ref.id];
      const frozen=(CATEGORIES[collection.title]||[]).find(value=>value.key===entry.presentation.legacyPlaceId)||{};
      return Object.freeze({
        key:entry.presentation.legacyPlaceId,
        emoji:frozen.emoji??entry.presentation.emoji,
        title:frozen.title??entry.title,
        sub:frozen.sub??entry.subtitle
      });
    }))
  ])));
  const eventsByDay=Object.values(model.events).reduce((out,event)=>{
    const key=String(event.presentation.dayNumber);
    (out[key]||(out[key]=[])).push(event);
    return out;
  },{});
  Object.values(eventsByDay).forEach(events=>events.sort((a,b)=>a.presentation.order-b.presentation.order));
  const itineraryData=Object.freeze(Object.fromEntries(Object.entries(eventsByDay).map(([dayNumber,events])=>{
    const frozenDay=ITINERARY_DATA[dayNumber];
    return [dayNumber,Object.freeze({
      title:frozenDay.title,
      kicker:frozenDay.kicker,
      heading:frozenDay.heading,
      legend:Object.freeze((frozenDay.legend||[]).slice()),
      items:Object.freeze(events.map(event=>Object.freeze({
        id:event.presentation.legacyId,
        time:event.timeText,
        title:event.title,
        details:event.notes,
        route:event.routeToNext||'',
        map:event.presentation.map||'',
        type:event.eventType,
        dayId:event.presentation.dayId,
        placeId:event.placeId,
        bookingId:event.bookingIds[0]||null,
        ...(event.presentation.guidePlaceIds.length?{guideIds:event.presentation.guidePlaceIds}:{}),
        ...(event.presentation.showShoppingDirectory?{showShoppingDirectory:true}:{})
      }))),
      dayId:frozenDay.dayId
    })];
  })));
  const dayLinks={};
  Object.values(model.guideEntries).forEach(entry=>{
    const links=entry.relatedEventIds.map(id=>{
      const event=model.events[id];
      return Object.freeze([
        `Day ${event.presentation.dayNumber}`,
        `day.html?day=${event.presentation.dayNumber}#${event.presentation.legacyId}`
      ]);
    });
    dayLinks[entry.presentation.legacyPlaceId]=Object.freeze(links);
  });
  const bookings=Object.freeze(Object.fromEntries(Object.values(model.bookings).map(booking=>{
    const frozen=BOOKINGS_DATA[booking.id];
    return [booking.id,Object.freeze({
      id:booking.id,
      type:booking.bookingType,
      title:booking.presentation.title,
      status:booking.status,
      date:frozen.date,
      time:frozen.time,
      placeId:booking.targetRef.id==='tan-son-nhat-airport'?null:booking.targetRef.id,
      dayId:booking.presentation.legacyDayId,
      guests:booking.presentation.guests,
      reference:booking.reference,
      contact:booking.provider,
      address:booking.addressSnapshot,
      mapUrl:booking.presentation.mapUrl,
      paymentStatus:booking.paymentStatus,
      notes:booking.notes,
      reminders:booking.reminders,
      attachmentsPlaceholder:booking.presentation.attachmentsPlaceholder
    })];
  })));
  const participants=Object.freeze({
    defaultKey:model.parties[trip.defaultPartyId].participantIds[0],
    order:Object.freeze(TRIP_CONFIG.participants.order.slice()),
    identities:Object.freeze(Object.fromEntries(trip.participantIds.map(id=>{
      const participant=model.participants[id];
      return [id,Object.freeze({emoji:participant.presentation.emoji,name:participant.displayName})];
    })))
  });
  const friends=Object.freeze(Object.fromEntries(trip.participantIds.map(id=>{
    const participant=model.participants[id];
    return [id,`${participant.presentation.emoji} ${participant.displayName}`];
  })));

  function legacyExpenseToCanonical(record,index=0){
    const id=record.id||`legacy-expense-${record.createdAt||'unknown'}-${index}`;
    const split=record.type==='personal'?[record.consumedBy||record.paidBy]:(record.split?.length?record.split:[record.paidBy]);
    const total=Number(record.total)||0;
    const base=Math.floor(total/split.length);
    let remainder=total-base*split.length;
    return Object.freeze({
      id,
      tripId:trip.id,
      description:record.item,
      money:Object.freeze({amountMinor:total,currency:'VND'}),
      paidByPartyId:VN_CANONICAL.ids.partyId(record.paidBy),
      allocations:Object.freeze(split.map(key=>Object.freeze({partyId:VN_CANONICAL.ids.partyId(key),amountMinor:base+(remainder-->0?1:0)}))),
      createdAt:record.createdAt,
      ...(record.editedAt?{editedAt:record.editedAt}:{})
    });
  }
  function legacyMomentToCanonical(record,index=0){
    const authorId=trip.participantIds.find(id=>friends[id]===record.friendLabel)||participants.defaultKey;
    const context=record.context||{};
    let contextRef=null;
    if(context.activityId&&context.dayId){
      const day=String(context.dayId).replace(/^day/,'');
      const id=VN_CANONICAL.ids.eventId(day,context.activityId);
      if(model.events[id])contextRef=Object.freeze({type:'Event',id});
    }else if(context.placeKey&&model.places[context.placeKey]){
      contextRef=Object.freeze({type:'Place',id:context.placeKey});
    }
    return Object.freeze({
      id:record.id||`legacy-moment-${record.savedAt||record.createdAt||'unknown'}-${index}`,
      tripId:trip.id,
      authorParticipantId:authorId,
      ...(contextRef?{contextRef}:{contextType:'trip'}),
      text:record.text||'',
      rating:Number(record.rating)||0,
      moods:Object.freeze((record.moods||[]).slice()),
      titleSnapshot:record.itemTitle||context.displayTitleSnapshot||'',
      createdAt:record.savedAt||record.createdAt,
      ...(record.editedAt?{editedAt:record.editedAt}:{})
    });
  }

  root.VN_PRESENTATION=Object.freeze({
    trip,
    participants,
    friends,
    days:Object.freeze(TRIP_CONFIG.days.map(day=>Object.freeze({...day}))),
    places,
    categories,
    dayLinks:Object.freeze(dayLinks),
    guideOrder,
    tripData:TRIP_DATA,
    tripOrder:Object.freeze(TRIP_ORDER.slice()),
    bookings,
    itineraryData,
    compatibility:Object.freeze({legacyExpenseToCanonical,legacyMomentToCanonical})
  });
})(globalThis);
