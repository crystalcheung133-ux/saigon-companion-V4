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
    tripGeneration:1,
    version:'stage-e-global-config-final',
    buildLabel:'VN Stage E · Global Configuration Final',
    features:Object.freeze({
      /* Stage 3.2D validation flag. Legacy remains authoritative. */
      expenseCanonicalDualWrite:false,
      expenseCanonicalReadShadow:false,
      bookingSupabaseFoundation:true,
      travelSyncCore:true,
      bookingSyncAdapter:true,
      bookingSyncRuntime:true,
      bookingSyncMode:'certification',
      bookingSupabaseSync:true
    }),
    participants
    ,parties:Object.freeze({
      defaultPartyId:'party-crystal',
      order:Object.freeze(['party-christal','party-crystal','party-mero','party-vivian']),
      identities:Object.freeze({
        'party-christal':Object.freeze({
          partyId:'party-christal',displayName:'Christal',
          legacyAliases:Object.freeze(['christal']),ordering:1,
          permissions:Object.freeze({adminEligible:false})
        }),
        'party-crystal':Object.freeze({
          partyId:'party-crystal',displayName:'Crystal',
          legacyAliases:Object.freeze(['crystal']),ordering:2,
          permissions:Object.freeze({adminEligible:false})
        }),
        'party-mero':Object.freeze({
          partyId:'party-mero',displayName:'Mero',
          legacyAliases:Object.freeze(['mero']),ordering:3,
          permissions:Object.freeze({adminEligible:false})
        }),
        'party-vivian':Object.freeze({
          partyId:'party-vivian',displayName:'Vivian',
          legacyAliases:Object.freeze(['vivian']),ordering:4,
          permissions:Object.freeze({adminEligible:false})
        })
      })
    })
    ,days:Object.freeze([
      Object.freeze({number:1,emoji:'👋',date:'30 Oct',weekday:'Friday'}),
      Object.freeze({number:2,emoji:'🍳',date:'31 Oct',weekday:'Saturday'}),
      Object.freeze({number:3,emoji:'🌿',date:'1 Nov',weekday:'Sunday'}),
      Object.freeze({number:4,emoji:'🏛',date:'2 Nov',weekday:'Monday'}),
      Object.freeze({number:5,emoji:'✈️',date:'3 Nov',weekday:'Tuesday'})
    ])
  });
})(globalThis);

// Stage E private-trip certification configuration.
// This scoped token is intentionally browser-visible in Trusted Party Selector mode.
globalThis.CCMV_SUPABASE_CONFIG = Object.freeze({
  enabled: true,
  url: "https://dafgbqygccvctifrevpa.supabase.co",
  anonKey: "sb_publishable_gjObd52pFWZh5VDWD5wKZw_jHxzV7yP",
  tripAccessToken: "ccmv_vn_2026_7LxA9rPqK2mN8VfH5tYwQ3eUzC1JsBdR",
  tripId: "ccmv-vietnam-2026",
  schema: "public"
});
