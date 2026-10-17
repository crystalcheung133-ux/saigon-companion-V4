(function(root){'use strict';
const $=id=>document.getElementById(id);function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function bookingTargets(){
 const out=[],seen=new Set();
 const bookings=root.BOOKING_AUTHORITY?.all?.(root.PRODUCTION_BOOKINGS?.byId)||Object.values(root.PRODUCTION_BOOKINGS?.byId||{});
 bookings.forEach(b=>{const canonical=String(b&&b.id||'').trim();if(!canonical||seen.has(canonical))return;seen.add(canonical);out.push({value:canonical,label:b.title||canonical})});
 return out;
}
function timelineDays(){
 const days=root.ITINERARY_DATA||root.TRAVEL_DATASETS?.ITINERARY_DATA||{};
 return Object.entries(days).map(([key,d])=>({value:key,label:d?.kicker||d?.title||('Day '+key),items:d?.items||[]}));
}
function fillOptions(sel,items,value){if(!sel)return;sel.innerHTML=items.map(x=>`<option value="${esc(x.value)}">${esc(x.label)}</option>`).join('');if(value!=null)sel.value=String(value);if(sel.selectedIndex<0&&sel.options.length)sel.selectedIndex=0}
function fillTimelineEvents(prefix,dayValue,eventValue){
 const daySel=$(prefix+'TimelineDay'),eventSel=$(prefix+'TimelineEvent');if(!daySel||!eventSel)return;
 const days=timelineDays();fillOptions(daySel,days,dayValue);
 const chosen=days.find(x=>String(x.value)===String(daySel.value))||days[0];
 const events=(chosen?.items||[]).filter(it=>it?.id).map(it=>({value:it.id,label:(it.time?it.time+' · ':'')+(it.title||it.id)}));
 fillOptions(eventSel,events,eventValue);
}
function setLinkEditor(prefix,type='trip',linkId=''){
 const typeSel=$(prefix+'LinkType'),bookingSel=$(prefix+'BookingLink');if(!typeSel)return;
 typeSel.value=type||'trip';
 fillOptions(bookingSel,bookingTargets(),type==='booking'?linkId:'');
 let day='',event='';if(type==='timeline'&&linkId){const bits=String(linkId).split('::');day=bits[0]||'';event=bits[1]||''}
 fillTimelineEvents(prefix,day,event);updateLinkEditor(prefix);
}
function updateLinkEditor(prefix){
 const type=$(prefix+'LinkType')?.value||'trip';
 const bookingRow=$(prefix+'BookingRow'),dayRow=$(prefix+'TimelineDayRow'),eventRow=$(prefix+'TimelineEventRow');
 if(bookingRow){const show=type==='booking';bookingRow.hidden=!show;bookingRow.style.display=show?'grid':'none'}if(dayRow){const show=type==='timeline';dayRow.hidden=!show;dayRow.style.display=show?'grid':'none'}if(eventRow){const show=type==='timeline';eventRow.hidden=!show;eventRow.style.display=show?'grid':'none'}
}
function readLinkEditor(prefix){
 const type=$(prefix+'LinkType')?.value||'trip';
 if(type==='booking'){const sel=$(prefix+'BookingLink'),id=sel?.value||'';return id?{linkType:'booking',linkId:id,linkLabel:sel.selectedOptions[0]?.textContent||id}:{linkType:'trip',linkId:'',linkLabel:'Trip-wide'}}
 if(type==='timeline'){const day=$(prefix+'TimelineDay')?.value||'',sel=$(prefix+'TimelineEvent'),event=sel?.value||'';return day&&event?{linkType:'timeline',linkId:day+'::'+event,linkLabel:sel.selectedOptions[0]?.textContent?.replace(/^.*? · /,'')||event}:{linkType:'trip',linkId:'',linkLabel:'Trip-wide'}}
 return {linkType:'trip',linkId:'',linkLabel:'Trip-wide'};
}
function wireLinkEditor(prefix){
 const type=$(prefix+'LinkType'),day=$(prefix+'TimelineDay');if(type)type.onchange=()=>updateLinkEditor(prefix);if(day)day.onchange=()=>fillTimelineEvents(prefix,day.value,'');
}
function renderTargets(){setLinkEditor('doc','trip','');const disabled=!root.TRIP_DOCUMENTS.canLink();['docLinkType','docBookingLink','docTimelineDay','docTimelineEvent'].forEach(id=>{if($(id))$(id).disabled=disabled})}
function routeForDocument(d,origin='page'){
 const back=origin==='viewer'?`documents.html?document=${encodeURIComponent(d.id)}`:'documents.html';
 if(d.linkType==='booking'&&d.linkId)return `#booking:${encodeURIComponent(d.linkId)}`;
 if(d.linkType==='timeline'&&d.linkId){const [day,item]=String(d.linkId).split('::');return `day.html?day=${encodeURIComponent(day)}#${encodeURIComponent(item||'')}`}
 return ''
}

function openDocumentLinkedEntity(documentId,origin,event){
 if(event){event.preventDefault();event.stopPropagation();}
 const d=root.TRIP_DOCUMENTS.read().find(x=>x.id===documentId);if(!d)return false;
 if(d.linkType==='booking'&&d.linkId){
   if(typeof window.returnToBookingDetail==='function'){ window.returnToBookingDetail(d.linkId); return false; }
   return false;
 }
 if(d.linkType==='timeline'&&d.linkId){
   const [day,item]=String(d.linkId).split('::');
   window.location.href=`day.html?day=${encodeURIComponent(day)}#${encodeURIComponent(item||'')}`;return false;
 }
 return false;
}
window.openDocumentLinkedEntity=openDocumentLinkedEntity;
function render(){
 const list=root.TRIP_DOCUMENTS.read(),box=$('documentsList'),folders=root.TRIP_DOCUMENT_FOLDERS?.visibleFolders(list)||[];
 $('docCount').textContent=`${list.length} ${list.length===1?'document':'documents'}`;
 const card=d=>{const can=root.TRIP_DOCUMENTS.canManage(d);return `<article class="expense-card document-history-card">
   <div class="document-history-title"><span aria-hidden="true">${d.mimeType?.startsWith('image/')?'🖼️':d.mimeType?.includes('pdf')?'📄':'📎'}</span><button class="document-title-open" type="button" onclick="openDocumentViewer('${esc(d.id)}')" aria-label="Open ${esc(d.title)}">${esc(d.title)}</button>${d.pinned?'<span class="document-pin" title="Pinned">📌</span>':''}</div>
   <p class="timestamp">${esc(d.category||'Other')}${d.uploadPending?' · Not synced':''}</p>
   ${d.note?`<p>${esc(d.note)}</p>`:''}
   ${d.linkType&&d.linkType!=='trip'&&d.linkLabel?`<p class="document-link-row">🔗 <a href="${esc(routeForDocument(d,'page'))}" onclick="return openDocumentLinkedEntity('${esc(d.id)}','page',event)">${esc(d.linkLabel)}</a></p>`:''}
   <div class="entry-actions document-entry-actions">
     ${can?`<button class="mini-btn" onclick="openEditDocument('${esc(d.id)}')">✏️ Edit</button>`:''}
     ${can&&d.uploadPending?`<button class="mini-btn" onclick="repairDocument('${esc(d.id)}')">☁️ Sync file</button>`:''}
     ${can?`<button class="mini-btn" onclick="deleteDoc('${esc(d.id)}')">🗑 Delete</button>`:''}
   </div></article>`};
 const rootDocs=(root.TRIP_DOCUMENT_FOLDERS?.rootDocuments(list)||list.filter(d=>(d.filedUnder||'all')==='all'));
 let html=rootDocs.map(card).join('')||'<div class="empty-state">No shared documents yet.</div>';
 if(folders.length){html+=`<div class="document-folder-heading"><span>Personal folders</span></div>`+folders.map(f=>{const docs=list.filter(d=>root.TRIP_DOCUMENT_FOLDERS.inFolder(d,f.key));return `<details class="document-folder"><summary>📁 ${esc(f.label)} <span>${docs.length}</span></summary><div class="document-folder-list">${docs.map(card).join('')}</div></details>`}).join('')}
 box.innerHTML=html;
}

root.openEditDocument=id=>{
 const d=root.TRIP_DOCUMENTS.read().find(x=>x.id===id);if(!d||!root.TRIP_DOCUMENTS.canManage(d))return;
 $('editDocId').value=d.id;$('editDocTitle').value=d.title||'';root.TRIP_DOCUMENT_FOLDERS?.fillSelect($('editDocFiledUnder'),d.filedUnder||'all');$('editDocCategory').value=d.category||'Other';$('editDocPin').checked=!!d.pinned;setLinkEditor('editDoc',d.linkType||'trip',d.linkId||'');['editDocLinkType','editDocBookingLink','editDocTimelineDay','editDocTimelineEvent'].forEach(id=>{if($(id))$(id).disabled=!root.TRIP_DOCUMENTS.canLink()});
 $('editDocModal').classList.add('show');$('editDocModal').setAttribute('aria-hidden','false');
};
root.closeEditDocument=()=>{$('editDocModal').classList.remove('show');$('editDocModal').setAttribute('aria-hidden','true')};
root.saveDocumentEdit=()=>{
 const id=$('editDocId').value;if(!id)return false;const link=readLinkEditor('editDoc');
 const patch={title:$('editDocTitle').value.trim()||'Document',filedUnder:$('editDocFiledUnder')?.value||'all',category:$('editDocCategory').value,pinned:$('editDocPin').checked};if(root.TRIP_DOCUMENTS.canLink())Object.assign(patch,link);
 root.closeEditDocument();
 const pending=root.TRIP_DOCUMENTS.update(id,patch);render();
 Promise.resolve(pending).then(render).catch(e=>console.error('Document metadata sync pending',e));
 return true;
};

root.repairDocument=id=>{
 const doc=root.TRIP_DOCUMENTS.read().find(d=>d.id===id);if(!doc)return;
 const input=document.createElement('input');input.type='file';input.accept='image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
 input.onchange=async()=>{const file=input.files&&input.files[0];if(!file)return;try{await root.TRIP_DOCUMENTS.repair(id,file);render();await root.TRIP_DOCUMENTS.sync();render()}catch(e){alert('Could not sync this document yet. Please try again when online.')}};
 input.click();
};

root.togglePin=async id=>{const d=root.TRIP_DOCUMENTS.read().find(x=>x.id===id);if(d)await root.TRIP_DOCUMENTS.update(id,{pinned:!d.pinned});render()};root.deleteDoc=async id=>{if(confirm('Delete this document?')){await root.TRIP_DOCUMENTS.remove(id);render()}};

async function ensurePdfJs(){if(window.pdfjsLib)return window.pdfjsLib;return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='vendor-pdfjs-3.11.174.min.js';s.onload=()=>resolve(window.pdfjsLib);s.onerror=reject;document.head.appendChild(s)})}
async function renderPdfInto(url,wrap){
 await ensurePdfJs();
 wrap.innerHTML='<div class="doc-viewer-message">Loading document…</div>';
 try{
  if(!root.pdfjsLib)throw new Error('PDF viewer unavailable');
  root.pdfjsLib.GlobalWorkerOptions.workerSrc='vendor-pdfjs-worker-3.11.174.min.js';
  const pdf=await root.pdfjsLib.getDocument(url).promise;wrap.innerHTML='';
  const dpr=Math.min(2.5,Math.max(1,root.devicePixelRatio||1));
  for(let n=1;n<=pdf.numPages;n++){
   const page=await pdf.getPage(n),base=page.getViewport({scale:1});
   const cssWidth=Math.min(1100,Math.max(280,wrap.clientWidth-24));
   const cssScale=Math.min(2,cssWidth/base.width),cssVp=page.getViewport({scale:cssScale});
   const renderVp=page.getViewport({scale:cssScale*dpr}),canvas=document.createElement('canvas');
   canvas.className='pdf-page';canvas.width=Math.ceil(renderVp.width);canvas.height=Math.ceil(renderVp.height);
   canvas.style.width=Math.ceil(cssVp.width)+'px';canvas.style.height=Math.ceil(cssVp.height)+'px';
   wrap.appendChild(canvas);await page.render({canvasContext:canvas.getContext('2d'),viewport:renderVp}).promise;
  }
 }catch(e){wrap.innerHTML='<div class="doc-viewer-message"><strong>Could not preview this document.</strong><p>Try again while online.</p></div>'}
}
root.openDocumentViewer=id=>{const d=root.TRIP_DOCUMENTS.read().find(x=>x.id===id);if(!d)return;let url=d.fileUrl||d.localObjectUrl||'';if(d.embeddedBase64){try{const raw=atob(d.embeddedBase64),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);url=URL.createObjectURL(new Blob([bytes],{type:d.mimeType||'application/pdf'}));}catch(e){}}$('docViewerTitle').textContent=d.title||'Document';const body=$('docViewerBody');body.innerHTML='';
if(d.linkType&&d.linkType!=='trip'&&d.linkLabel){const link=document.createElement('a');link.className='pill doc-viewer-linked-entity';link.href=routeForDocument(d,'viewer');link.textContent='🔗 '+d.linkLabel;link.onclick=function(event){return openDocumentLinkedEntity(d.id,'viewer',event)};body.appendChild(link)}
if(!url){body.innerHTML='<div class="doc-viewer-message">This document is not available on this device yet.</div>'}else if((d.mimeType||'').startsWith('image/')){const img=document.createElement('img');img.src=url;img.alt=d.title||'Document';body.appendChild(img)}else if((d.mimeType||'').includes('pdf')||/\.pdf(?:$|\?)/i.test(url)){const wrap=document.createElement('div');wrap.className='pdf-pages';body.appendChild(wrap);renderPdfInto(url,wrap)}else{const wrap=document.createElement('div');wrap.className='doc-viewer-message';wrap.innerHTML='<strong>'+esc(d.fileName||d.title||'Document')+'</strong><p>This file type opens in its native viewer.</p><a class="pill" target="_blank" rel="noopener">Open original file</a>';wrap.querySelector('a').href=url;body.appendChild(wrap)}$('docViewer').classList.add('show');$('docViewer').setAttribute('aria-hidden','false');root.bringContentOverlayToFront?.($('docViewer'));document.body.style.overflow='hidden'};
root.closeDocumentViewer=()=>{if(typeof root.dismissAllContentOverlays==='function')return root.dismissAllContentOverlays();const v=$('docViewer');v.classList.remove('show');v.setAttribute('aria-hidden','true');$('docViewerBody').innerHTML='';document.body.style.overflow='';return true};
root.resetDocumentsView=()=>{try{root.closeDocumentViewer()}catch(e){};try{root.closeAddDocument()}catch(e){};const f=$('docForm');if(f)f.reset();const save=$('docSave');if(save){save.disabled=false;save.textContent='Save Document'};document.body.style.overflow=''};

root.openAddDocument=()=>{root.TRIP_DOCUMENT_FOLDERS?.fillSelect($('docFiledUnder'),'all');setLinkEditor('doc','trip','');$('docModal').classList.add('show')};
root.closeAddDocument=()=>{$('docModal').classList.remove('show');const f=$('docForm');if(f)f.reset();const save=$('docSave');if(save){save.disabled=false;save.textContent='Save Document'}};
root.saveDocument=async()=>{const file=$('docFile').files[0];if(!file){alert('Choose a photo, PDF or Word document.');return}const title=$('docTitle').value.trim()||file.name;const link=root.TRIP_DOCUMENTS.canLink()?readLinkEditor('doc'):{linkType:'trip',linkId:'',linkLabel:'Trip-wide'};$('docSave').disabled=true;$('docSave').textContent='Saving…';await root.TRIP_DOCUMENTS.add({title,filedUnder:$('docFiledUnder')?.value||'all',category:$('docCategory').value,note:'',pinned:$('docPin').checked,...link},file);$('docSave').disabled=false;$('docSave').textContent='Save Document';$('docForm').reset();closeAddDocument();render()};
document.addEventListener('DOMContentLoaded',()=>{wireLinkEditor('doc');wireLinkEditor('editDoc');renderTargets();render();const id=new URLSearchParams(location.search).get('document')||sessionStorage.getItem('travel_engine_return_document_v1')||sessionStorage.getItem('travel_engine_open_document_v1');if(id){sessionStorage.removeItem('travel_engine_open_document_v1');sessionStorage.removeItem('travel_engine_return_document_v1');setTimeout(async()=>{await root.openDocumentViewer(id);document.documentElement.classList.add('handoff-ready');document.documentElement.classList.remove('handoff-prepaint')},0)}else{document.documentElement.classList.add('handoff-ready');document.documentElement.classList.remove('handoff-prepaint')}});document.addEventListener('travelengine:documentschanged',render);document.addEventListener('travelengine:adminmodechange',()=>{renderTargets();render()});
window.addEventListener('pageshow',()=>{if(document.visibilityState!=='visible')return;const q=new URLSearchParams(location.search);if(!q.get('document'))root.resetDocumentsView?.();});
})(globalThis);
