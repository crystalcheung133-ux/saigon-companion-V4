/* Engine 25.7.2 shared Documents filing helpers. Classification only; not access control.
   Root Documents is the shared/default view; participant folders only appear when populated. */
(function(root){'use strict';
function options(){const d=root.TRIP_DOCUMENTS;if(!d)return [{key:'all',label:'Documents'}];return [{key:'all',label:'Documents'}].concat(d.participantKeys().map(k=>({key:k,label:d.participantLabel(k)})));}
function fillSelect(select,value){if(!select)return;select.innerHTML=options().map(x=>`<option value="${x.key}">${x.label}</option>`).join('');select.value=(root.TRIP_DOCUMENTS?.validFolder(value)||'all');}
function visibleFolders(list){const d=root.TRIP_DOCUMENTS;if(!d)return [];const used=new Set((list||d.read()).map(x=>d.validFolder(x?.filedUnder)).filter(k=>k!=='all'));return d.participantKeys().filter(k=>used.has(k)).map(k=>({key:k,label:d.participantLabel(k)}));}
function rootDocuments(list){const d=root.TRIP_DOCUMENTS;return (list||d?.read?.()||[]).filter(x=>(d?.validFolder(x?.filedUnder)||'all')==='all');}
function inFolder(doc,key){const d=root.TRIP_DOCUMENTS,k=String(key||'all');return (d?.validFolder(doc?.filedUnder)||'all')===k;}
root.TRIP_DOCUMENT_FOLDERS=Object.freeze({options,fillSelect,visibleFolders,rootDocuments,inFolder});
})(globalThis);
