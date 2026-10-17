#!/usr/bin/env python3
import contextlib, http.server, os, socketserver, threading, time, sys, re, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
    def end_headers(self):
        self.send_header("Cache-Control","no-store")
        super().end_headers()

@contextlib.contextmanager
def server():
    old=os.getcwd(); os.chdir(ROOT)
    httpd=socketserver.TCPServer(("127.0.0.1",0),QuietHandler)
    t=threading.Thread(target=httpd.serve_forever,daemon=True);t.start()
    try: yield f"http://127.0.0.1:{httpd.server_address[1]}"
    finally:
        httpd.shutdown();httpd.server_close();os.chdir(old)


@contextlib.contextmanager
def target_base():
    external=os.environ.get('BROWSER_BASE_URL','').strip().rstrip('/')
    if external:
        yield external
    else:
        with server() as base:
            yield base

def check(cond,msg):
    if not cond: raise AssertionError(msg)

def shown(page,sel):
    return page.locator(sel).evaluate("""el=>{
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0&&r.width>0&&r.height>0;
    }""")

def top_owner(page,sel):
    return page.locator(sel).evaluate("""el=>{
      const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+Math.min(r.height/2,180);
      const top=document.elementFromPoint(x,y);
      return !!top && (top===el || el.contains(top));
    }""")

def nav_visible(page):
    return page.locator('.app-nav').evaluate("""el=>{
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0&&r.width>0&&r.height>0;
    }""")

def select_crystal(page):
    page.wait_for_selector('#mamaModal.show')
    page.locator('#mamaModal .family-choice[data-family="crystal"]').click()
    page.wait_for_function("!document.getElementById('mamaModal').classList.contains('show')")

def open_selector(page):
    page.locator('.friend-pill').click()
    page.wait_for_selector('#mamaModal.show')
    page.wait_for_selector('#tripStudioSelectorToggle')

def studio_login(page):
    open_selector(page)
    page.locator('#tripStudioSelectorToggle').click()
    page.wait_for_selector('#adminPinModal:not([hidden])')
    pin=page.evaluate("TRIP_CONFIG.admin.pin")
    page.locator('#adminPinInput').fill(str(pin))
    page.locator('#adminPinForm').evaluate("(f)=>f.requestSubmit()")
    page.wait_for_selector('#tripStudioModal.show')

def close_studio(page):
    page.locator('#tripStudioModal .trip-studio-close').click()
    page.wait_for_function("!document.getElementById('tripStudioModal').classList.contains('show')")

def assert_studio_foreground(page,stage):
    check(shown(page,'#tripStudioModal'),f'{stage}: Studio modal not visible')
    check(shown(page,'#adminModeControl'),f'{stage}: Studio card not visible')
    check(top_owner(page,'#adminModeControl'),f'{stage}: Studio card is not foreground hit-test owner')
    check(nav_visible(page),f'{stage}: bottom navigation disappeared')
    z=page.locator('#tripStudioModal').evaluate("el=>Number(getComputedStyle(el).zIndex)||0")
    hero=page.locator('.home-hero, .hero, main').first
    if hero.count():
        hz=hero.evaluate("el=>Number(getComputedStyle(el).zIndex)||0")
        check(z>hz,f'{stage}: Studio z-index {z} is not above page/hero {hz}')

def assert_studio_closed_clean(page,stage):
    check(not page.locator('#tripStudioModal').evaluate("el=>el.classList.contains('show')"),f'{stage}: Studio modal show class remains')
    check(page.locator('#tripStudioModal').get_attribute('aria-hidden')=='true',f'{stage}: Studio aria-hidden not restored')
    check(not shown(page,'#tripStudioModal'),f'{stage}: Studio overlay remains visible after Close')
    check(not shown(page,'#adminModeControl'),f'{stage}: ghost Studio card remains visible after Close')
    check(nav_visible(page),f'{stage}: bottom navigation missing after Studio Close')

def guide_to_booking(page,day,item_id):
    page.goto(f'{page.url.split("/")[0]}//{page.url.split("/")[2]}/day.html?day={day}',wait_until='domcontentloaded')
    page.wait_for_timeout(120)
    card=page.locator(f'#{item_id}')
    check(card.count()==1,f'Timeline card #{item_id} missing')
    guide=card.locator('.timeline-action--guide')
    booking=card.locator('.timeline-action--trip')
    check(guide.count()>0,f'{item_id}: Guide action missing')
    check(booking.count()>0,f'{item_id}: Booking action missing')

    # Direct Booking must own foreground.
    booking.click()
    page.wait_for_selector('#tripModal.show')
    check(top_owner(page,'#tripModal .trip-sheet'),f'{item_id}: direct Booking sheet is behind page/hero')
    check(nav_visible(page),f'{item_id}: nav disappeared while Booking open')
    page.locator('#tripModal .trip-close').click()
    page.wait_for_function("!document.getElementById('tripModal').classList.contains('show')")

    # Guide -> Booking stacking must preserve Guide underneath Booking.
    guide.click()
    page.wait_for_selector('#guideModal.show')
    check(top_owner(page,'#guideModal .guide-sheet'),f'{item_id}: Guide sheet is behind page/hero')
    check(nav_visible(page),f'{item_id}: nav disappeared while Guide open')
    b=page.locator('#guideModal button.utility-button',has_text='Booking')
    check(b.count()>0,f'{item_id}: Guide card has no linked Booking button')
    b.click()
    page.wait_for_selector('#tripModal.show')
    check(page.locator('#guideModal').evaluate("el=>el.classList.contains('show')"),f'{item_id}: Guide closed instead of stacking under Booking')
    gz=page.locator('#guideModal').evaluate("el=>Number(getComputedStyle(el).zIndex)||0")
    tz=page.locator('#tripModal').evaluate("el=>Number(getComputedStyle(el).zIndex)||0")
    check(tz>gz,f'{item_id}: Booking z-index {tz} must exceed Guide {gz}')
    check(top_owner(page,'#tripModal .trip-sheet'),f'{item_id}: Guide→Booking sheet is not foreground hit-test owner')
    # RC29.86: reverse switch must promote the already-open Guide above Booking.
    reverse=page.locator('#tripModal .trip-action-btn--guide',has_text='View Guide')
    check(reverse.count()>0,f'{item_id}: linked Booking has no View Guide action')
    reverse.first.click()
    check(top_owner(page,'#guideModal .guide-sheet'),f'{item_id}: Booking→Guide did not promote Guide to foreground')
    check(page.locator('#tripModal').evaluate("el=>el.classList.contains('show')"),f'{item_id}: reverse Guide switch destroyed Booking stack')
    page.locator('#guideModal button.utility-button',has_text='Booking').click()
    check(top_owner(page,'#tripModal .trip-sheet'),f'{item_id}: Guide→Booking second switch did not restore Booking foreground')
    page.locator('#tripModal .trip-close').click()
    page.wait_for_function("!document.getElementById('tripModal').classList.contains('show')")
    check(page.locator('#guideModal').evaluate("el=>el.classList.contains('show')"),f'{item_id}: closing Booking did not return to Guide')
    check(top_owner(page,'#guideModal .guide-sheet'),f'{item_id}: Guide did not regain foreground after Booking close')
    page.locator('#guideModal .guide-close').click()

def run_viewport(browser,base,viewport,label):
      context=browser.new_context(viewport=viewport)
      context.add_init_script("window.TRAVEL_ENGINE_SUPABASE={enabled:false};")
      # RC29.89: install the deterministic FX provider before any app script runs.
      # This prevents WebKit from creating a cross-origin request lifecycle at all;
      # production still uses the real providers because this exists only in CI.
      context.add_init_script(r"""
      (() => {
        const nativeFetch = window.fetch.bind(window);
        window.__CI_FX_FETCH_HITS = [];
        window.fetch = function(input, init) {
          const url = String(input && input.url ? input.url : input || '');
          if (/api\.frankfurter\.dev\/v1\/latest/i.test(url)) {
            window.__CI_FX_FETCH_HITS.push(url);
            return Promise.resolve(new Response(JSON.stringify({amount:1,base:'VND',date:'2026-09-22',rates:{AUD:0.000057}}), {status:200,headers:{'Content-Type':'application/json'}}));
          }
          if (/latest\.currency-api\.pages\.dev\/v1\/currencies\/vnd\.json/i.test(url)) {
            window.__CI_FX_FETCH_HITS.push(url);
            return Promise.resolve(new Response(JSON.stringify({date:'2026-09-22',vnd:{aud:0.000057}}), {status:200,headers:{'Content-Type':'application/json'}}));
          }
          return nativeFetch(input, init);
        };
      })();
      """)
      page=context.new_page()
      production_fx_requests=[]
      def observe_request(request):
          u=request.url.lower()
          if 'api.frankfurter.dev/' in u or 'latest.currency-api.pages.dev/' in u:
              production_fx_requests.append(request.url)
      page.on('request',observe_request)
      errors=[]
      page.on('pageerror',lambda e: errors.append(str(e)))
      try:
        page.goto(base+'/index.html',wait_until='domcontentloaded')
        page.evaluate("document.getElementById('ccmvSplash')?.remove()")
        select_crystal(page)
        runtime_version=page.evaluate("TRIP_CONFIG.version")
        m=re.match(r'^RC([0-9.]+)-(.+)$',str(runtime_version or ''))
        check(bool(m),f'{label}: Runtime version malformed: {runtime_version}')
        expected_build=f'VN-RC{m.group(1)}|{m.group(2)}'
        actual_build=page.locator('meta[name="travel-engine-build"]').get_attribute('content')
        check(actual_build==expected_build,f'{label}: Build identity mismatch: {actual_build} != {expected_build}')

        studio_login(page)
        assert_studio_foreground(page,label+' PIN open')
        close_studio(page)
        assert_studio_closed_clean(page,label+' first Close')

        # Active Studio session: User Selector is direct Studio re-entry.
        page.locator('.friend-pill').click()
        page.wait_for_selector('#tripStudioModal.show')
        check(not page.locator('#mamaModal').evaluate("el=>el.classList.contains('show')"),
              label+': active User Selector incorrectly opened traveller selector')
        assert_studio_foreground(page,label+' active User Selector reopen')
        close_studio(page)
        assert_studio_closed_clean(page,label+' second Close')

        page.reload(wait_until='domcontentloaded')
        page.evaluate("document.getElementById('ccmvSplash')?.remove()")
        page.wait_for_timeout(100)
        assert_studio_closed_clean(page,label+' reload')
        page.locator('.friend-pill').click()
        page.wait_for_selector('#tripStudioModal.show')
        check(not page.locator('#mamaModal').evaluate("el=>el.classList.contains('show')"),
              label+': reload active User Selector incorrectly opened traveller selector')
        assert_studio_foreground(page,label+' reload active re-entry')
        close_studio(page)

        # Studio-only Booking edit entry: while Studio session is active, Booking detail exposes Edit Booking.
        page.goto(base+'/index.html',wait_until='domcontentloaded')
        page.evaluate("document.getElementById('ccmvSplash')?.remove()")
        page.evaluate("openGenericBookingDetail('bk-transfer-in')")
        page.wait_for_selector('#tripModal.show')
        check(page.locator('#tripModalContent .booking-edit-btn',has_text='Edit Booking').count()==1,
              label+': Studio mode did not expose Edit Booking for confirmed airport transfer')
        transfer_text=page.locator('#tripModalContent').inner_text()
        check('CONFIRMED' in transfer_text.upper(),label+': airport transfer did not render confirmed in Studio')
        page.locator('#tripModal .trip-close').click()

        # Booking Save lifecycle regression: remote sync may be slow/unavailable, but the
        # local authoritative commit must complete and dismiss the editor without waiting on
        # network. The remote promise is deliberately left unresolved during the UI assertion.
        marker=f'post-commit-sync-check-{label}'
        dialogs=[]
        page.once('dialog',lambda d:(dialogs.append(d.message),d.accept()))
        page.evaluate("""() => {
          window.__realBookingSync=window.BOOKING_SYNC;
          window.__pendingRemoteSync=new Promise(()=>{});
          window.BOOKING_SYNC=Object.assign({},window.BOOKING_SYNC,{
            enabled:()=>true,
            push: () => window.__pendingRemoteSync
          });
        }""")
        page.evaluate("openGenericBookingDetail('bk-transfer-in')")
        page.wait_for_selector('#tripModal.show')
        page.locator('#tripModalContent .booking-edit-btn').click()
        page.wait_for_selector('#bookingEditForm')
        page.locator('#bookingEditForm textarea[name="importantInfo"]').fill(marker)
        page.locator('#bookingEditForm .booking-edit-save').click()
        page.wait_for_selector('#bookingEditForm',state='detached',timeout=5000)
        check(not dialogs,label+': slow remote sync incorrectly showed a save-failure alert: '+' | '.join(dialogs))
        reopened_text=page.locator('#tripModalContent').inner_text()
        check(marker in reopened_text,label+': local authoritative value was not persisted before remote sync completed')
        page.locator('#tripModal .trip-close').click()
        page.evaluate("""() => { if(window.__realBookingSync) window.BOOKING_SYNC=window.__realBookingSync; }""")

        # Double-submit protection: while a save is in flight, a second Save click must not
        # start a second commit. Delay the (real, non-mocked) local save so a same-tick second
        # click lands while the button is still disabled, then confirm only one commit occurs.
        page.evaluate("openGenericBookingDetail('bk-transfer-in')")
        page.wait_for_selector('#tripModal.show')
        page.locator('#tripModalContent .booking-edit-btn').click()
        page.wait_for_selector('#bookingEditForm')
        submit_count=page.evaluate("""() => {
          window.__submitCount=0;
          // Count the actual user submit boundary. BOOKING_AUTHORITY.save can also be invoked
          // by canonical reconciliation and is therefore not a valid proxy for double-clicks.
          window.__doubleSubmitRealSaveBookingEdit=window.saveBookingEdit;
          window.saveBookingEdit=function(...args){
            window.__submitCount+=1;
            return window.__doubleSubmitRealSaveBookingEdit.apply(this,args);
          };
          return window.__submitCount;
        }""")
        page.locator('#bookingEditForm textarea[name="importantInfo"]').fill(marker+'-double-submit')
        save_button=page.locator('#bookingEditForm .booking-edit-save')
        # Capture the original DOM node before the first click. A Playwright Locator re-resolves
        # after DOM replacement; on fast WebKit the saved-booking detail can reopen within the
        # 300 ms second-click window and the same locator may target a *new* Save button, falsely
        # reporting two user commits. A real double-tap targets the original control.
        original_save_button=save_button.element_handle()
        check(original_save_button is not None,label+': could not capture original Save button node')
        original_save_button.click()
        check(save_button.is_disabled(),label+': Save button must be disabled synchronously on first click to block double-submit')
        # A second click while disabled must be refused outright by Playwright's actionability
        # checks (a disabled control cannot receive a real click) — proving the browser itself
        # blocks the double-submit, not merely that our own code ignored a synthetic second call.
        second_click_blocked=False
        try:
            original_save_button.click(timeout=300)
        except Exception:
            second_click_blocked=True
        check(second_click_blocked,label+': a second click on the disabled Save button was not refused — double-submit is not actually blocked')
        page.wait_for_selector('#bookingEditForm',state='detached',timeout=5000)
        final_submit_count=page.evaluate("window.__submitCount")
        check(final_submit_count==1,label+f': double-submit guard failed — expected exactly 1 submit handler invocation, got {final_submit_count}')
        page.evaluate("""() => {
          if(window.__doubleSubmitRealSaveBookingEdit) window.saveBookingEdit=window.__doubleSubmitRealSaveBookingEdit;
        }""")
        page.locator('#tripModal .trip-close').click()

        page.evaluate("window.exitTripStudioMode && window.exitTripStudioMode()")
        page.wait_for_timeout(50)

        # Outside Studio the same Booking must not expose Edit Booking.
        page.evaluate("openGenericBookingDetail('bk-transfer-in')")
        page.wait_for_selector('#tripModal.show')
        check(page.locator('#tripModalContent .booking-edit-btn').count()==0,
              label+': Edit Booking leaked outside Studio mode')
        page.locator('#tripModal .trip-close').click()

        # Timeline → direct Booking. Select whichever D2 fixture item currently exposes both
        # a Guide and a Booking action rather than a specific itinerary name, so this exercises
        # the generic routing/stacking contract regardless of what the current itinerary is.
        page.goto(base+'/day.html?day=2',wait_until='domcontentloaded')
        page.wait_for_timeout(120)
        candidate=page.locator('.timeline-item').filter(has=page.locator('.timeline-action--trip')).filter(has=page.locator('.timeline-action--guide')).first
        check(candidate.count()==1,label+': no D2 Timeline item exposes both Guide and Booking actions to exercise routing')
        item_id=candidate.get_attribute('id')
        card=page.locator(f'#{item_id}')
        booking=card.locator('.timeline-action--trip')
        guide=card.locator('.timeline-action--guide')
        check(booking.count()>0 and guide.count()>0,label+': selected D2 Timeline fixture must expose Guide and Booking')
        booking.click(); page.wait_for_selector('#tripModal.show')
        check(top_owner(page,'#tripModal .trip-sheet'),label+': Direct Booking sheet is behind page/hero')
        check(nav_visible(page),label+': bottom nav disappeared during direct Booking')
        page.locator('#tripModal .trip-close').click()

        # Timeline → Guide → Booking → Close Booking MUST return directly to Timeline.
        guide.click(); page.wait_for_selector('#guideModal.show')
        check(top_owner(page,'#guideModal .guide-sheet'),label+': Guide sheet is behind page/hero')
        check(page.evaluate("window.GUIDE_MODAL_ORIGIN")=='timeline',label+': Guide origin was not recorded as timeline')
        linked=page.locator('#guideModal button.utility-button',has_text='Booking')
        check(linked.count()>0,label+': Guide linked Booking button missing')
        linked.click(); page.wait_for_selector('#tripModal.show')
        check(page.locator('#guideModal').evaluate("el=>el.classList.contains('show')"),label+': Guide must remain stacked while Booking is open')
        gz=page.locator('#guideModal').evaluate("el=>Number(getComputedStyle(el).zIndex)||0")
        tz=page.locator('#tripModal').evaluate("el=>Number(getComputedStyle(el).zIndex)||0")
        check(tz>gz,f'{label}: Guide→Booking stacking wrong: Trip {tz}, Guide {gz}')
        check(top_owner(page,'#tripModal .trip-sheet'),label+': Guide→Booking sheet is not foreground owner')
        page.locator('#tripModal .trip-close').click()
        page.wait_for_function("!document.getElementById('tripModal').classList.contains('show')")
        check(not page.locator('#guideModal').evaluate("el=>el.classList.contains('show')"),label+': Timeline-origin Guide remained open after Booking Close')
        check(page.locator(f'#{item_id}').count()==1,label+': Timeline context was not retained')
        check(page.evaluate("window.GUIDE_MODAL_ORIGIN") is None,label+': Timeline Guide origin was not cleared')
        check(nav_visible(page),label+': bottom nav missing after Timeline return')

        # Change Effect Gate: poison persisted booking state with pre-reconciliation-style stale
        # overrides, reload, then assert the rendered Booking UI still reflects the CURRENT deploy
        # master — using values read live from the app's own canonical data, never a hardcoded
        # itinerary literal, so this survives any future change to the actual trip content.
        canonical=page.evaluate("""() => {
          const pick=(cat)=>Object.values(BOOKINGS_DATA).find(b=>b&&b.status!=='optional'&&(b.bookingCategory===cat||b.category===cat));
          const spa=pick('Spa'), restaurant=pick('Restaurants'), transfer=BOOKINGS_DATA['bk-transfer-in'];
          return {
            spa: spa&&{id:spa.id,title:spa.title,time:spa.time},
            restaurant: restaurant&&{id:restaurant.id,title:restaurant.title,time:restaurant.time},
            transferReference: transfer&&transfer.reference,
            masterRevision: (window.TRIP_CONFIG&&TRIP_CONFIG.bookingMasterRevision)||1
          };
        }""")
        check(canonical['spa'],label+': no non-optional canonical Spa booking found to exercise the Change Effect Gate')
        check(canonical['restaurant'],label+': no non-optional canonical Restaurant booking found to exercise the Change Effect Gate')
        check(canonical['transferReference'],label+': fixture bk-transfer-in has no reference to exercise the Change Effect Gate')

        page.evaluate("""(canonical) => {
          // Legacy unstamped cache is not a saved Studio edit; stamped edits win across deploys.
          const stale={};
          stale[canonical.spa.id]={id:canonical.spa.id,bookingId:canonical.spa.id,title:'Stale Cached Spa Name',time:'23:59',status:'pending'};
          stale[canonical.restaurant.id]={id:canonical.restaurant.id,bookingId:canonical.restaurant.id,title:'Stale Cached Restaurant Name',time:'23:59',status:'pending'};
          stale['bk-stale-removed-fixture']={id:'bk-stale-removed-fixture',bookingId:'bk-stale-removed-fixture',title:'Ghost Booking From A Removed Fixture',status:'pending',bookingCategory:'Spa',category:'Spa'};
          stale['bk-transfer-in']={id:'bk-transfer-in',bookingId:'bk-transfer-in',title:'Stale Cached Transfer',status:'pending',displayStatus:'Pending'};
          stale['bk-fusion-original']={id:'bk-fusion-original',bookingId:'bk-fusion-original',title:'Stale Cached Accommodation',status:'pending',displayStatus:'Pending'};
          STORAGE.local.writeJSON(BOOKING_AUTHORITY.key,{version:1,overrides:stale,deletedIds:[],updatedAt:'2026-08-01T00:00:00Z'});
        }""", canonical)
        page.reload(wait_until='domcontentloaded')
        page.evaluate("document.getElementById('ccmvSplash')?.remove()")

        page.evaluate("openGenericBookingDetail('bk-transfer-in')")
        page.wait_for_selector('#tripModal.show')
        transfer_after_stale=page.locator('#tripModalContent').inner_text().upper()
        check('CONFIRMED' in transfer_after_stale,label+': stale pending override rolled the transfer back from its deploy-master confirmed status')
        check(canonical['transferReference'] in page.locator('#tripModalContent').inner_text(),label+': deploy-master transfer reference lost after stale override')
        page.locator('#tripModal .trip-close').click()

        page.evaluate("openAccommodationDetail('bk-fusion-original')")
        page.wait_for_selector('#tripModal.show')
        fusion_after_stale=page.locator('#tripModalContent').inner_text().upper()
        check('CONFIRMED' in fusion_after_stale,label+': stale displayStatus poisoned confirmed accommodation rendering')
        check('PENDING' not in fusion_after_stale,label+': accommodation renderer still exposes stale displayStatus')
        page.locator('#tripModal .trip-close').click()

        page.evaluate("openBookingCategoryCard('Restaurants')")
        page.wait_for_selector('#tripModal.show')
        restaurant_text=page.locator('#tripModalContent').inner_text()
        check(canonical['restaurant']['title'] in restaurant_text,label+': rendered Restaurants list lost the deploy-master booking title to a stale override')
        check(canonical['restaurant']['time'] in restaurant_text,label+': rendered Restaurants list lost the deploy-master booking time to a stale override')
        check('Stale Cached Restaurant Name' not in restaurant_text,label+': stale restaurant title survived into rendered UI')
        check('23:59' not in restaurant_text,label+': stale restaurant time survived into rendered UI')

        # Open the canonical restaurant detail and — only if it configures a bookingUrl — prove
        # a real, clickable Book Online action resolves to that exact configured URL.
        page.locator("#tripModalContent button, #tripModalContent .booking-picker-row").filter(has_text=canonical['restaurant']['title']).first.click()
        page.wait_for_timeout(50)
        restaurant_booking_url=page.evaluate(f"(BOOKINGS_DATA['{canonical['restaurant']['id']}']||{{}}).bookingUrl||''")
        if restaurant_booking_url:
            book_link=page.locator('#tripModalContent a.trip-action-btn--book')
            check(book_link.count()>0,label+': restaurant has a configured bookingUrl but rendered no Book Online action')
            check(book_link.first.get_attribute('href')==restaurant_booking_url,label+': restaurant Book Online action does not resolve to its configured bookingUrl')
        page.locator('#tripModal .trip-close').click()

        page.evaluate("openBookingCategoryCard('Spa')")
        page.wait_for_selector('#tripModal.show')
        spa_text=page.locator('#tripModalContent').inner_text()
        check('Ghost Booking From A Removed Fixture' not in spa_text,label+': a stale override for a booking id no longer in canonical data resurrected content in the rendered Spa list')
        check(canonical['spa']['title'] in spa_text,label+': rendered Spa list lost the deploy-master booking title to a stale override')
        check(canonical['spa']['time'] in spa_text,label+': rendered Spa list lost the deploy-master booking time to a stale override')
        check('Stale Cached Spa Name' not in spa_text,label+': stale spa title survived into rendered UI')
        check('23:59' not in spa_text,label+': stale spa time survived into rendered UI')

        # Open the canonical spa detail and verify only the contact channels the booking itself
        # actually configures are rendered as real, actionable links — never a hardcoded
        # itinerary-specific channel, phone number, or destination.
        page.locator("#tripModalContent button, #tripModalContent .booking-picker-row").filter(has_text=canonical['spa']['title']).first.click()
        page.wait_for_timeout(50)
        spa_channels=page.evaluate(f"""() => {{
          const b=BOOKINGS_DATA['{canonical['spa']['id']}']||{{}};
          const digits=String(b.whatsapp||'').replace(/[^0-9]/g,'');
          return {{
            bookingUrl: b.bookingUrl||'',
            whatsapp: (b.whatsapp&&digits)?('https://wa.me/'+digits):'',
            messenger: b.messengerUrl||'',
            instagram: b.instagramUrl||''
          }};
        }}""")
        if spa_channels['bookingUrl']:
            link=page.locator('#tripModalContent a.trip-action-btn--book')
            check(link.count()>0,label+': spa has a configured bookingUrl but rendered no Book Online action')
            check(link.first.get_attribute('href')==spa_channels['bookingUrl'],label+': spa Book Online action does not resolve to its configured bookingUrl')
        if spa_channels['whatsapp']:
            check(page.locator('#tripModalContent a.trip-action-btn--whatsapp').count()>0,label+': spa has a configured whatsapp contact but rendered no WhatsApp action')
        if spa_channels['messenger']:
            check(page.locator('#tripModalContent a.trip-action-btn--messenger').count()>0,label+': spa has a configured messengerUrl but rendered no Messenger action')
        if spa_channels['instagram']:
            check(page.locator('#tripModalContent a.trip-action-btn--instagram').count()>0,label+': spa has a configured instagramUrl but rendered no Instagram action')
        page.locator('#tripModal .trip-close').click()

        check(not errors,label+': Browser page errors: '+' | '.join(errors))
        # The app may call fetch(), but the init-script provider must satisfy FX
        # before Playwright sees any production-provider network request.
        check(not production_fx_requests,label+': production FX network request escaped CI provider: '+' | '.join(production_fx_requests))
        print(f'BROWSER VIEWPORT {label}: PASS')
      finally:
        context.close()

def run():
  with target_base() as base, sync_playwright() as pw:
    chromium=pw.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome') or None,args=['--no-sandbox'])
    try:
      run_viewport(chromium,base,{'width':1280,'height':800},'chromium-desktop-1280x800')
      run_viewport(chromium,base,{'width':390,'height':844},'chromium-mobile-390x844')
    finally:
      chromium.close()
    webkit=pw.webkit.launch(headless=True)
    try:
      run_viewport(webkit,base,{'width':390,'height':844},'webkit-mobile-390x844')
      run_viewport(webkit,base,{'width':430,'height':932},'webkit-mobile-430x932')
      print('BROWSER INTERACTION SMOKE: PASS — Chromium desktop/mobile + WebKit iPhone-class mobile matrix.')
    finally:
      webkit.close()

if __name__=='__main__':
  try: run()
  except Exception as e:
    print('BROWSER INTERACTION SMOKE: FAIL —',e,file=sys.stderr)
    raise
