#!/usr/bin/env python3
"""All Guide Visit Day links: real clicks, same-page + cross-page, and close stack."""
import contextlib, http.server, os, socketserver, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
class Handler(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a): pass
@contextlib.contextmanager
def server():
 old=os.getcwd();os.chdir(ROOT)
 class Server(socketserver.TCPServer):allow_reuse_address=True
 s=Server(('127.0.0.1',0),Handler);threading.Thread(target=s.serve_forever,daemon=True).start()
 try:yield 'http://127.0.0.1:'+str(s.server_address[1])
 finally:s.shutdown();s.server_close();os.chdir(old)
with server() as base,sync_playwright() as p:
 for browser_type in [p.chromium,p.webkit]:
  browser=browser_type.launch(headless=True,args=['--no-sandbox'] if browser_type.name=='chromium' else [])
  page=browser.new_page(viewport={'width':390,'height':844})
  page.add_init_script('window.TRAVEL_ENGINE_SUPABASE={enabled:false};')
  page.goto(base+'/day.html?day=5',wait_until='domcontentloaded')
  page.wait_for_timeout(500)
  if page.locator('#mamaModal.show .family-choice[data-family="crystal"]').count():page.locator('#mamaModal.show .family-choice[data-family="crystal"]').click()
  keys=page.evaluate('Object.keys(GenerationSelectionAdapter.view("guide").dayLinks).filter(k=>GUIDE_NAVIGATION.dayLinks(k).length)')
  for key in keys:
   page.goto(base+'/day.html?day=5',wait_until='domcontentloaded')
   page.wait_for_timeout(60)
   if page.locator('#mamaModal.show .family-choice[data-family="crystal"]').count():page.locator('#mamaModal.show .family-choice[data-family="crystal"]').click()
   page.evaluate('(key)=>openGuideModal(key)',key)
   links=page.locator('#guideModal .day-jump-button')
   if not links.count():continue
   href=links.first.get_attribute('href')
   links.first.click()
   page.wait_for_timeout(160)
   assert not page.locator('#guideModal.show').count(),f'{browser_type.name}: {key} Guide remained open after {href}'
   assert 'day.html' in page.url,f'{browser_type.name}: {key} did not reach Day page: {page.url}'
  print(browser_type.name,'PASS',len(keys),'Guide day-link candidates')
  browser.close()
