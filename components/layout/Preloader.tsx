import LogoMark from '@/components/ui/LogoMark';

/**
 * Branded splash shown once per browser tab session, on whichever page a
 * visitor lands on first — hidden the instant fonts + first paint are ready,
 * or immediately (via `sessionStorage`) on every subsequent view so it never
 * reappears during client-side navigation within the same tab.
 *
 * No React state: a blocking inline script toggles the DOM directly, so there
 * is nothing to hydrate and nothing that can flash before it runs.
 */
export default function Preloader() {
  const script = `(function(){
    var KEY='sb-preloader-seen';
    var el=document.getElementById('sb-preloader');
    if(!el)return;
    var seen;
    try{seen=sessionStorage.getItem(KEY);}catch(e){seen=null;}
    if(seen){el.style.display='none';return;}
    try{sessionStorage.setItem(KEY,'1');}catch(e){}
    var done=false;
    function reveal(){
      if(done)return;
      done=true;
      el.classList.add('sb-hide');
      setTimeout(function(){el.style.display='none';},550);
    }
    function ready(){
      requestAnimationFrame(function(){requestAnimationFrame(reveal);});
    }
    if(document.readyState==='complete'){ready();}
    else{window.addEventListener('load',ready);}
    setTimeout(reveal,4000);
  })();`;

  return (
    <>
      <div id="sb-preloader">
        <LogoMark variant="color" className="sb-preloader-mark" />
        <span className="sb-preloader-ring" />
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
