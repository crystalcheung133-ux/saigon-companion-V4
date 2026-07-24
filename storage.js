/* storage.js - reusable safe browser-storage facade. */
(function(root){
  'use strict';
  function area(store){
    return Object.freeze({
      get(key,fallback=null){try{const value=store.getItem(key);return value===null?fallback:value;}catch(e){return fallback;}},
      set(key,value){try{store.setItem(key,String(value));return true;}catch(e){return false;}},
      remove(key){try{store.removeItem(key);return true;}catch(e){return false;}},
      readJSON(key,fallback=null){const raw=this.get(key,null);if(raw===null)return fallback;try{return JSON.parse(raw);}catch(e){return fallback;}},
      writeJSON(key,value){return this.set(key,JSON.stringify(value));}
    });
  }
  root.STORAGE=Object.freeze({local:area(localStorage),session:area(sessionStorage)});
})(globalThis);
