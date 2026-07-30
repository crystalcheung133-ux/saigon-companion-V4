import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css=fs.readFileSync(new URL('./styles.css',import.meta.url),'utf8');
const bookings=fs.readFileSync(new URL('./bookings-runtime.js',import.meta.url),'utf8');
const data=fs.readFileSync(new URL('./data.js',import.meta.url),'utf8');
const trip=fs.readFileSync(new URL('./trip.html',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('./sw.js',import.meta.url),'utf8');

test('mobile Home releases fixed-height clipping to the document',()=>{
  assert.match(css,/html:has\(body\.home-bg\),\s*body\.home-bg\{[\s\S]*?height:auto!important;[\s\S]*?overflow-y:auto!important/);
  assert.match(css,/body\.home-bg main\.dashboard\.home-premium\.home-v37\{[\s\S]*?height:auto!important;[\s\S]*?max-height:none!important;[\s\S]*?overflow:visible!important/);
  assert.match(css,/body\.home-bg section\.home-brand-card\.v37-dashboard-home\{[\s\S]*?max-height:none!important;[\s\S]*?overflow:visible!important/);
});

test('Bookings main owns scrolling and the booking surface',()=>{
  assert.match(css,/body\.bookings-page\{[\s\S]*?overflow:hidden;[\s\S]*?padding-bottom:0/);
  assert.match(css,/body\.bookings-page \.bookings-content\{[\s\S]*?overflow-y:auto;[\s\S]*?background:inherit/);
});

test('all booking categories use one rhythm with no Spa runtime modifier',()=>{
  assert.match(css,/\.booking-group-active\{[\s\S]*?grid-auto-rows:96px/);
  assert.match(css,/\.booking-group-active \.booking-card,[\s\S]*?height:96px;[\s\S]*?min-height:96px/);
  assert.doesNotMatch(bookings,/booking-list-spa|booking-group-spa/);
});

test('retired Trip sections remain absent from navigation, data and authored content',()=>{
  assert.match(data,/const TRIP_ORDER = \["checklist", "flights", "stay", "emergency"\]/);
  for(const key of ['city','money','tips','weather']){
    assert.doesNotMatch(trip,new RegExp(`data-trip-key=["']${key}["']|id=["']${key}["']`));
    assert.doesNotMatch(data,new RegExp(`"${key}":\\{"title"`));
  }
});

test('service worker cache is advanced for Pack 2',()=>{
  assert.match(sw,/vn-ui-stabilisation-pack-2/);
  assert.doesNotMatch(sw,/CACHE_NAME=.*vn-ui-stabilisation-pack-1/);
});
