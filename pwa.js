/* pwa.js - single service-worker registration owner. */
(function(root){
  'use strict';
  function register(){
    if(!('serviceWorker' in navigator)) return Promise.resolve(null);
    return navigator.serviceWorker.register('./sw.js?v=stage2-canonical').catch(()=>null);
  }
  if(document.readyState==='complete') register();
  else root.addEventListener('load',register,{once:true});
  root.PWA=Object.freeze({register});
})(globalThis);
