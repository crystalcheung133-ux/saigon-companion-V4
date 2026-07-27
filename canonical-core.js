/* canonical-core.js - permanent CCMV Travel Engine canonical entity authority.
   Contains trip-neutral model construction, typed reference resolution and
   relationship validation. It has no Vietnam DOM, label, route or theme rules. */
(function(root){
  'use strict';

  const ENTITY_TYPES=Object.freeze([
    'trips','parties','participants','places','events','bookings',
    'collections','guideEntries','expenses','moments'
  ]);
  const REF_TYPES=Object.freeze({
    Trip:'trips',Party:'parties',Participant:'participants',Place:'places',
    Event:'events',Booking:'bookings',Collection:'collections',
    GuideEntry:'guideEntries',Expense:'expenses',Moment:'moments'
  });

  function fail(message){throw new Error(`Canonical Trip Model: ${message}`);}
  function asRecord(items,type){
    const record=Object.create(null);
    (items||[]).forEach(item=>{
      if(!item||typeof item.id!=='string'||!item.id.trim())fail(`${type} requires a stable id`);
      if(record[item.id])fail(`duplicate ${type} id "${item.id}"`);
      record[item.id]=Object.freeze({...item});
    });
    return Object.freeze(record);
  }
  function resolve(model,ref,context){
    if(!ref||!REF_TYPES[ref.type])fail(`${context} has an invalid typed reference`);
    const entity=model[REF_TYPES[ref.type]]?.[ref.id];
    if(!entity)fail(`${context} references missing ${ref.type} "${ref.id}"`);
    return entity;
  }
  function requireIds(record,ids,context){
    (ids||[]).forEach(id=>{if(!record[id])fail(`${context} references missing id "${id}"`);});
  }
  function validate(model){
    const tripIds=Object.keys(model.trips);
    if(tripIds.length!==1)fail('exactly one Trip is required');
    const trip=model.trips[tripIds[0]];
    requireIds(model.parties,trip.partyIds,'Trip.partyIds');
    requireIds(model.participants,trip.participantIds,'Trip.participantIds');
    if(trip.defaultPartyId&&!model.parties[trip.defaultPartyId])fail('Trip.defaultPartyId does not resolve');

    Object.values(model.parties).forEach(party=>{
      if(!Array.isArray(party.participantIds)||!party.participantIds.length)fail(`Party "${party.id}" has no Participants`);
      requireIds(model.participants,party.participantIds,`Party "${party.id}"`);
    });
    Object.values(model.events).forEach(event=>{
      if(event.placeId&&!model.places[event.placeId])fail(`Event "${event.id}" references missing Place "${event.placeId}"`);
      requireIds(model.bookings,event.bookingIds,`Event "${event.id}" bookingIds`);
      requireIds(model.parties,event.partyIds,`Event "${event.id}" partyIds`);
      requireIds(model.participants,event.participantIds,`Event "${event.id}" participantIds`);
    });
    Object.values(model.bookings).forEach(booking=>{
      resolve(model,booking.targetRef,`Booking "${booking.id}"`);
      if(booking.eventId){
        const event=model.events[booking.eventId];
        if(!event)fail(`Booking "${booking.id}" references missing Event "${booking.eventId}"`);
        if(!(event.bookingIds||[]).includes(booking.id))fail(`Booking "${booking.id}" and Event "${event.id}" are not reciprocal`);
      }
      requireIds(model.parties,booking.partyIds,`Booking "${booking.id}" partyIds`);
      requireIds(model.participants,booking.participantIds,`Booking "${booking.id}" participantIds`);
    });
    Object.values(model.events).forEach(event=>{
      (event.bookingIds||[]).forEach(id=>{
        if(model.bookings[id].eventId!==event.id)fail(`Event "${event.id}" and Booking "${id}" are not reciprocal`);
      });
    });
    Object.values(model.guideEntries).forEach(entry=>{
      resolve(model,entry.sourceRef,`GuideEntry "${entry.id}"`);
      requireIds(model.events,entry.relatedEventIds,`GuideEntry "${entry.id}" relatedEventIds`);
      requireIds(model.collections,entry.relatedCollectionIds,`GuideEntry "${entry.id}" relatedCollectionIds`);
    });
    Object.values(model.collections).forEach(collection=>{
      (collection.items||[]).forEach((item,index)=>resolve(model,item.ref,`Collection "${collection.id}" item ${index}`));
    });
    Object.values(model.expenses).forEach(expense=>{
      if(!model.parties[expense.paidByPartyId])fail(`Expense "${expense.id}" payer does not resolve`);
      let allocated=0;
      (expense.allocations||[]).forEach(allocation=>{
        if(!model.parties[allocation.partyId])fail(`Expense "${expense.id}" allocation Party does not resolve`);
        allocated+=Number(allocation.amountMinor)||0;
      });
      if(allocated!==Number(expense.money?.amountMinor))fail(`Expense "${expense.id}" allocations do not equal total`);
    });
    Object.values(model.moments).forEach(moment=>{
      if(!model.participants[moment.authorParticipantId])fail(`Moment "${moment.id}" author does not resolve`);
      if(moment.contextRef)resolve(model,moment.contextRef,`Moment "${moment.id}"`);
    });
    return Object.freeze({
      tripId:trip.id,
      counts:Object.freeze(Object.fromEntries(ENTITY_TYPES.map(type=>[type,Object.keys(model[type]).length])))
    });
  }
  function create(input){
    const model={};
    ENTITY_TYPES.forEach(type=>{model[type]=asRecord(input[type]||[],type);});
    const frozen=Object.freeze(model);
    const validation=validate(frozen);
    return Object.freeze({model:frozen,validation,resolve:ref=>resolve(frozen,ref,'resolve')});
  }

  root.CCMV_CANONICAL=Object.freeze({entityTypes:ENTITY_TYPES,create});
})(globalThis);
