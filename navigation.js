/* navigation.js - CCMV Travel Engine reusable owner.
   Owns route creation and Guide return-context state.
   Vietnam-specific values are supplied by config/data modules. */
function placeHref(key){
  return `place.html?id=${encodeURIComponent(key)}`;
}
const GUIDE_NAV_CONTEXT_KEY=STORAGE_CONFIG.keys.guideNavContext;
const GUIDE_NAV_REOPEN_KEY=STORAGE_CONFIG.keys.guideNavReopen;
function saveGuideNavigationContext(category){
  try{
    STORAGE.session.writeJSON(GUIDE_NAV_CONTEXT_KEY,{
      category,
      sourceUrl:window.location.href,
      savedAt:Date.now()
    });
  }catch(e){}
}
function readGuideNavigationContext(){
  try{return STORAGE.session.readJSON(GUIDE_NAV_CONTEXT_KEY,null);}
  catch(e){return null;}
}
function clearGuideNavigationContext(){
  try{
    STORAGE.session.remove(GUIDE_NAV_CONTEXT_KEY);
    STORAGE.session.remove(GUIDE_NAV_REOPEN_KEY);
  }catch(e){}
}
function goPlace(key){
  window.location.href = placeHref(key);
}
function closePlaceDetail(){
  const context=readGuideNavigationContext();
  if(context?.category&&context?.sourceUrl){
    try{STORAGE.session.set(GUIDE_NAV_REOPEN_KEY,context.category);}catch(e){}
    window.location.href=context.sourceUrl;
    return;
  }
  window.location.href='guide.html';
}
function restoreGuideNavigationLayer(){
  let category='';
  try{
    category=STORAGE.session.get(GUIDE_NAV_REOPEN_KEY,'');
    STORAGE.session.remove(GUIDE_NAV_REOPEN_KEY);
  }catch(e){}
  if(category)requestAnimationFrame(()=>openGuideCategory(category));
}
document.addEventListener('DOMContentLoaded',restoreGuideNavigationLayer);
