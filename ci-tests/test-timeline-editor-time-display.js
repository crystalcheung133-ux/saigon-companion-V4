const fs=require('fs');const assert=require('assert');const html=fs.readFileSync('day.html','utf8');
for(const token of ['name="timelineTimeDisplayMode" value="fixed"','name="timelineTimeDisplayMode" value="period"','id="timelineEditPeriod"','base.timeDisplayMode=','base.timeDisplayPeriod=','timeDisplayMode:document.querySelector','timeDisplayPeriod:document.getElementById','updateTimelineTimeDisplayControls()'])assert(html.includes(token),`Missing ${token}`);
assert(html.includes("if(mode==='fixed')")&&html.includes("if(mode==='period')"),'Both display branches required');
assert(html.includes("base.time=document.getElementById('timelineEditTime').value.trim()"),'Time must remain stored independently');
assert(html.indexOf("if(item&&item.bookingId)")<html.indexOf("const mode=String(item&&item.timeDisplayMode"),'Booking authority must override display mode');
console.log('TIMELINE EDITOR TIME DISPLAY: PASS');
