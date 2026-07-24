/* trip-config.js - canonical trip and participant model. */
(function(root){
  'use strict';
  const participants=Object.freeze({
    defaultKey:'crystal',
    order:Object.freeze(['christal','crystal','mero','vivian']),
    identities:Object.freeze({
      christal:Object.freeze({emoji:'🧸',name:'Christal'}),
      crystal:Object.freeze({emoji:'👓',name:'Crystal'}),
      mero:Object.freeze({emoji:'✝️',name:'Mero'}),
      vivian:Object.freeze({emoji:'👟',name:'Vivian'})
    })
  });
  root.TRIP_CONFIG=Object.freeze({
    id:'ccmv-vietnam-2026',
    name:'Saigon Companion',
    destination:'Ho Chi Minh City',
    country:'Vietnam',
    startDate:'2026-10-30',
    endDate:'2026-11-03',
    storageNamespace:'ccmv-vietnam-2026',
    version:'stage1-refactored',
    participants
    ,days:Object.freeze([
      Object.freeze({number:1,emoji:'👋',date:'30 Oct',weekday:'Friday'}),
      Object.freeze({number:2,emoji:'🍳',date:'31 Oct',weekday:'Saturday'}),
      Object.freeze({number:3,emoji:'🌿',date:'1 Nov',weekday:'Sunday'}),
      Object.freeze({number:4,emoji:'🏛',date:'2 Nov',weekday:'Monday'}),
      Object.freeze({number:5,emoji:'✈️',date:'3 Nov',weekday:'Tuesday'})
    ])
  });
})(globalThis);
