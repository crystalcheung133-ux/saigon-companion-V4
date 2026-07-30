import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const css=fs.readFileSync(new URL('./styles.css',import.meta.url),'utf8');
const data=fs.readFileSync(new URL('./data.js',import.meta.url),'utf8');
const trip=fs.readFileSync(new URL('./trip.html',import.meta.url),'utf8');
const expenses=fs.readFileSync(new URL('./expenses-runtime.js',import.meta.url),'utf8');
const guide=fs.readFileSync(new URL('./guide.html',import.meta.url),'utf8');
const guideRuntime=fs.readFileSync(new URL('./guide-runtime.js',import.meta.url),'utf8');

test('mobile booking tabs and cards share fixed dimensions',()=>{
 assert.match(css,/\.booking-tab,\.booking-tab\.active\{height:58px;min-height:58px/);
 assert.match(css,/\.booking-card,\.booking-card-row,\.booking-card-main\{min-height:94px\}/);
 assert.doesNotMatch(css,/#bookingList\.booking-list-spa \.booking-card-main/);
});
test('booking modal retains nav clearance on mobile',()=>{
 assert.doesNotMatch(css,/--booking-nav-clearance:calc\(12px/);
 assert.match(css,/padding:14px 14px var\(--booking-nav-clearance\)/);
});
test('shared pages and mini menu include safe area',()=>{
 assert.match(css,/padding:30px 18px calc\(112px \+ env\(safe-area-inset-bottom\)\)/);
 assert.match(css,/bottom:calc\(82px \+ env\(safe-area-inset-bottom\)\)/);
});
test('retired Trip sections are deleted',()=>{
 assert.match(data,/const TRIP_ORDER = \["checklist", "flights", "stay", "emergency"\]/);
 for(const key of ['city','money','tips','weather']){
  assert.doesNotMatch(trip,new RegExp(`id=["']${key}["']`));
  assert.doesNotMatch(data,new RegExp(`"${key}":\\{"title"`));
 }
});
test('Expenses page suppresses modal quick history',()=>{
 assert.match(expenses,/body\.classList\.contains\('expenses-page'\)/);
});
test('man-moi is authored in Guide HTML, not inserted at runtime',()=>{
 assert.match(guide,/place\.html\?id=man-moi/);
 assert.doesNotMatch(guideRuntime,/dataset\.guidePlace='man-moi'/);
});
