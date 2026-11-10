/* Companion 25.6.9 — local-first Booking-page creation and link actions.
   Security: client-side PIN is a UI gate only. No cloud sync is claimed. */
(function(root){'use strict';
 const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const storageKey=String(root.TRIP_CONFIG&&root.TRIP_CONFIG.storageNamespace||'trip')+':studio_links:v1';
 function editable(){return !!(root.isAdminMode&&root.isAdminMode());}
 function itinerary(){return root.GenerationSelectionAdapter&&root.GenerationSelectionAdapter.view('itinerary').days||{};}
 function dayKey(d){return String(d).replace(/^day/,'');}
 function dayItems(d){const n=dayKey(d);const base=itinerary()[n]||{};return root.ITINERARY_AUTHORITY.resolveDayItems(n,base.items||[]);}
 function allPlaces(){return root.TRAVEL_DATASETS&&root.TRAVEL_DATASETS.PLACES||{};}
 function options(items,selected){return items.map(([v,t])=>`<option value="${esc(v)}" ${String(v)===String(selected)?'selected':''}>${esc(t)}</option>`).join('');}
 function dateForDay(day){const m=String(day||'').match(/^day(\d+)$/);if(!m)return '';const a=String(root.TRIP_CONFIG.startDate).split('-').map(Number);return new Date(Date.UTC(a[0],a[1]-1,a[2]+Number(m[1])-1)).toISOString().slice(0,10);}
 function show(){
  if(!editable()){alert('Open Studio Mode to create a Booking.');return;}
  let shade=document.getElementById('studioCreateBookingSheet');if(!shade){shade=document.createElement('div');shade.id='studioCreateBookingSheet';shade.className='trip-studio-modal show';shade.style.zIndex='100050';shade.innerHTML='<div class="trip-studio-modal-inner" style="max-height:90dvh;overflow:auto;padding:22px"><button type="button" id="createBookingClose" class="pill">Close</button><h2>Create Booking</h2><form id="studioCreateBookingForm" class="booking-edit-form"><div id="createBookingInputs" class="booking-edit-grid"></div><button class="pill" type="submit">Save new Booking</button></form></div>';document.body.append(shade);shade.querySelector('#createBookingClose').onclick=()=>shade.remove();shade.addEventListener('click',e=>{if(e.target===shade)shade.remove()});shade.querySelector('form').onsubmit=save;}
  const days=Object.keys(itinerary()).sort((a,b)=>Number(a.replace(/\D/g,''))-Number(b.replace(/\D/g,'')));
  const dayOptions=[['','No day'],...days.map(d=>['day'+dayKey(d),`Day ${dayKey(d)}`])];
  const activityOptions=[['','No Activity'],...days.flatMap(d=>dayItems(d).map(a=>[a.id,`Day ${dayKey(d)} · ${a.title}`]))];
  const placeOptions=[['','No Guide / Place'],...Object.entries(allPlaces()).map(([id,p])=>[id,p.title||id])];
  const fields=[['title','Title','text',true],['type','Type','select',false,[['restaurant','Restaurant'],['accommodation','Accommodation'],['activity','Activity'],['spa','Spa'],['transport','Transport'],['other','Other']]],['status','Status','select',false,[['pending','Pending'],['confirmed','Confirmed']]],['dayId','Link Day','select',false,dayOptions],['timelineItemId','Link Activity','select',false,activityOptions],['placeId','Link Guide / Place','select',false,placeOptions],['date','Date','date'],['time','Time','time'],['reference','Confirmation No.','text'],['platform','Booking Platform','text'],['guests','Guests','text'],['phone','Phone','tel'],['whatsapp','WhatsApp','tel'],['email','Email','email'],['website','Website','url'],['price','Price','text'],['discountAmount','Discount','text'],['cashbackAmount','Cashback','text'],['depositAmount','Deposit','text'],['totalAmount','Total','text'],['currency','Currency','text'],['cancellation','Cancellation Policy','textarea'],['specialNotes','Special Notes','textarea']];
  shade.querySelector('#createBookingInputs').innerHTML=fields.map(([name,label,type,required,choices])=>`<label class="booking-edit-field"><span>${esc(label)}</span>${type==='select'?`<select name="${name}">${options(choices)}</select>`:type==='textarea'?`<textarea name="${name}" rows="3"></textarea>`:`<input name="${name}" type="${type}" ${required?'required':''}>`}</label>`).join('');
  const f=shade.querySelector('form');f.elements.dayId.addEventListener('change',()=>{if(f.elements.dayId.value&&!f.elements.date.value)f.elements.date.value=dateForDay(f.elements.dayId.value)});
  f.elements.timelineItemId.addEventListener('change',()=>{const a=Object.keys(itinerary()).flatMap(d=>dayItems(d)).find(x=>x.id===f.elements.timelineItemId.value);if(a){f.elements.dayId.value=a.dayId||'';f.elements.date.value=dateForDay(a.dayId);if(!f.elements.time.value&&/^\d\d:\d\d$/.test(a.time||''))f.elements.time.value=a.time;if(!f.elements.title.value)f.elements.title.value=a.title;if(a.placeId)f.elements.placeId.value=a.placeId;}});
 }
 function save(e){e.preventDefault();if(!editable())return false;
  const f=e.currentTarget,values=Object.fromEntries(new FormData(f));const title=String(values.title||'').trim();if(!title){alert('Booking title required');return false;}
  const activityId=values.timelineItemId||'';const dayId=values.dayId||'';let dayNumber=Number(String(dayId).replace(/\D/g,''));if(dayId&&(!dayNumber||!itinerary()[String(dayNumber)])){alert('Invalid day');return false;}
  if(activityId){const all=Object.keys(itinerary()).flatMap(d=>dayItems(d));const found=all.find(a=>a.id===activityId);if(!found){alert('Activity not found');return false;}if(found.bookingId){alert('Activity already linked to a Booking');return false;}if(dayId!==found.dayId){alert('Linked Activity belongs to a different Day');return false;}}
  const id='bk-studio-'+(root.crypto&&root.crypto.randomUUID?root.crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2));
  const record=Object.assign({},values,{id,origin:'studio',updatedAt:new Date().toISOString(),status:values.status||'pending',dayId:dayId||'',timelineItemId:activityId,notes:values.specialNotes||'',bookingViaOther:'',bookingWay:values.platform||''});
  delete record.specialNotes;
  const created=root.BOOKING_AUTHORITY.save(id,record,null);if(!created.ok){alert('Booking was not saved: '+created.reason);return false;}
  if(activityId){const original=dayItems(dayId);const next=original.map(a=>a.id===activityId?Object.assign({},a,{bookingId:id}):a);try{root.ITINERARY_AUTHORITY.commitDayChanges({['itineraryDay'+dayNumber]:{day:dayNumber,items:next}});}catch(err){root.BOOKING_AUTHORITY.remove(id);alert('Could not link Activity: '+err.message);return false;}}
  document.getElementById('studioCreateBookingSheet')?.remove();alert('Booking saved locally. Cloud sync is not configured for this Beta.');location.href='trip.html?bookingId='+encodeURIComponent(id);return false;
 }
 function inject(){
  const host=document.getElementById('bookingCreateActionHost');
  if(!host)return;
  let btn=document.getElementById('bookingPageCreateButton');
  if(!btn){btn=document.createElement('button');btn.id='bookingPageCreateButton';btn.className='pill';btn.type='button';btn.textContent='＋ Create Booking';btn.addEventListener('click',show);host.appendChild(btn);}
  btn.hidden=!editable();
 }

 document.addEventListener('travelengine:adminmodechange',()=>setTimeout(inject,0));
 document.addEventListener('DOMContentLoaded',()=>setTimeout(inject,50));
 root.CompanionStudioCreateBooking=Object.freeze({open:show,dateForDay});
})(globalThis);
