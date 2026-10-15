from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:5173')
 sentence=page.locator('.sentence'); answer=page.locator('#answer')
 first=sentence.inner_text()
 assert not answer.is_visible()
 sentence.tap(); assert answer.is_visible()
 assert page.locator('#answer a').get_attribute('href').startswith('https://')
 sentence.tap(); assert not answer.is_visible()
 page.locator('.next').click();page.wait_for_timeout(450)
 second=sentence.inner_text();assert first!=second;assert not answer.is_visible()
 page.keyboard.press('ArrowLeft');page.wait_for_timeout(450);assert sentence.inner_text()==first
 page.keyboard.press('ArrowRight');page.wait_for_timeout(450);assert sentence.inner_text()==second
 saved=page.evaluate('localStorage.getItem("mudan-bungakusho:history:v1")')
 page.reload();assert sentence.inner_text()==second
 assert page.evaluate('localStorage.getItem("mudan-bungakusho:history:v1")')==saved
 # Synthetic pointer gestures exercise axis classification and pointer state.
 def swipe(dx,dy=0):
  sentence.dispatch_event('pointerdown',{'pointerId':1,'isPrimary':True,'button':0,'clientX':240,'clientY':340})
  sentence.dispatch_event('pointermove',{'pointerId':1,'isPrimary':True,'clientX':240+dx,'clientY':340+dy})
  sentence.dispatch_event('pointerup',{'pointerId':1,'isPrimary':True,'clientX':240+dx,'clientY':340+dy})
  page.wait_for_timeout(450)
 before=sentence.inner_text();swipe(-100);assert sentence.inner_text()!=before;assert not answer.is_visible()
 swipe(100);assert sentence.inner_text()==before
 swipe(5,110);assert sentence.inner_text()==before;assert not answer.is_visible()
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.screenshot(path='tests/mobile.png')
 sentence.tap();page.screenshot(path='tests/mobile-answer.png')
 page.emulate_media(reduced_motion='reduce');page.locator('.next').click();assert not answer.is_visible()
 page.set_viewport_size({'width':1440,'height':900});page.screenshot(path='tests/desktop.png')
 assert not errors,errors
 browser.close()
 print('PASS: mobile tap, source link, next/previous, keyboard, reload, horizontal/vertical gestures, reduced motion, desktop, no overflow or JS errors')
