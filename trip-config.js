/* trip-config.js — Stage 7A-1 canonical trip identity configuration. */
(function(root){
  'use strict';

  const config = Object.freeze({
    tripName: 'CCMV Saigon Companion',
    destination: 'Saigon',
    country: 'Vietnam',
    startDate: '2026-10-30',
    endDate: '2026-11-03',
    currency: root.LOCALE_CONFIG.currency,
    timeZone: root.LOCALE_CONFIG.timeZone,
    language: root.LOCALE_CONFIG.language,
    logo: Object.freeze({
      splash: root.ASSET_CONFIG.branding.splashLogo,
      header: root.ASSET_CONFIG.branding.secondaryMark,
      icon192: root.ASSET_CONFIG.icons.icon192,
      icon512: root.ASSET_CONFIG.icons.icon512
    }),
    coverImage: root.ASSET_CONFIG.hero.coverImage,
    themeName: root.THEME_CONFIG.name,

    /* Existing presentation labels retained here so identity has one owner. */
    engineName: 'CCMV Travel Engine',
    shortName: 'CCMV',
    navLabel: 'Saigon Companion',
    familyLabel: 'CRYSTAL · CHRISTAL · MERO · VIVIAN',
    participants: Object.freeze({
      defaultKey: 'crystal',
      order: Object.freeze(['crystal','christal','mero','vivian']),
      identities: Object.freeze({
        crystal: Object.freeze({code:'👓',name:'Crystal'}),
        christal: Object.freeze({code:'🧸',name:'Christal'}),
        mero: Object.freeze({code:'✝️',name:'Mero'}),
        vivian: Object.freeze({code:'👟',name:'Vivian'})
      })
    }),
    home: Object.freeze({
      ariaLabel: 'Saigon Companion home',
      reunionStory: 'Four friends. One beautiful escape.',
      dateLine: '30 Oct — 3 Nov 2026',
      regionLine: 'Ho Chi Minh City',
      clockLabel: 'Saigon',
      clockSuffix: 'SGN',
      seasonLabel: 'Saigon city escape',
      seasonNote: 'Warm days · tropical showers possible',
      welcomeMessage: 'Welcome to Saigon',
      completedMessage: 'Thanks for the moments'
    }),
    guide: Object.freeze({ excludedPlaceIds: Object.freeze([]) }),
    exports: Object.freeze({ expenseSummaryTitle: 'CCMV SAIGON EXPENSE SUMMARY' }),
    heroLine1: 'Saigon',
    heroEmphasis: 'Companion',
    tagline: 'Dine · Discover · Unwind',
    splashSlogan: 'TRAVEL TOGETHER, CAPTURE TOGETHER',
    splashDestination: 'SAIGON 2026',
    storageNamespace: 'ccmv-saigon-2026',
    version: 'SAIGON v1.0',
    buildLabel: 'Vietnam Master File Production Feed',
    theme: root.THEME_CONFIG.colors
  });

  root.TRIP_CONFIG = config;

  function applyTripIdentity(){
    if(typeof document==='undefined') return;
    document.documentElement.lang = config.language;

    document.querySelectorAll('[data-trip-page-title]').forEach(function(el){
      const page = el.getAttribute('data-trip-page-title');
      document.title = page ? page + ' · ' + config.tripName : config.tripName;
    });
    document.querySelectorAll('[data-brand-text]').forEach(function(el){
      const key = el.getAttribute('data-brand-text');
      const value = config[key];
      if(value==null) return;
      if(key==='splashSlogan') el.innerHTML=String(value).replace(/\n/g,'<br>');
      else el.textContent=value;
    });
    document.querySelectorAll('[data-brand-logo]').forEach(function(img){
      const key=img.getAttribute('data-brand-logo');
      if(config.logo[key]) img.src=config.logo[key];
    });
    document.querySelectorAll('[data-trip-icon]').forEach(function(link){
      const key=link.getAttribute('data-trip-icon');
      if(config.logo[key]) link.href=config.logo[key];
    });
    document.querySelectorAll('[data-trip-apple-title]').forEach(function(meta){
      meta.content=config.destination;
    });
    document.querySelectorAll('[data-trip-theme-color]').forEach(function(meta){
      meta.content=config.theme.primary;
    });
    document.querySelectorAll('[data-trip-currency-placeholder]').forEach(function(input){
      input.placeholder='Total ' + root.LOCALE_CONFIG.currency.code;
    });
    document.querySelectorAll('[data-locale-currency-placeholder]').forEach(function(input){
      input.placeholder='0.00 ' + root.LOCALE_CONFIG.currency.code;
    });
  }

  root.applyTripIdentity = applyTripIdentity;
  if(typeof document!=='undefined'){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',applyTripIdentity);
    else applyTripIdentity();
  }
})(globalThis);
