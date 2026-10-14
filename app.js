/* Paytm Intelligence - client onboarding portal logic */
(function(){
"use strict";

/* =====================================================================
   SUBMISSION SETUP
   Each form posts to its original Google Form, so responses land in the
   same sheet with the same column names. Paste the entry-ID map for each
   form below (see the instructions that came with this file). Keys must be
   the exact question titles. Example: {"Company / Business Name":"entry.123456789"}
   ===================================================================== */
var CFG=window.PI_CONFIG||{},FORM_IDS=CFG.FORM_IDS||{},ENTRY=CFG.ENTRY||{},HIDDEN_SELECT_VALUE=CFG.HIDDEN_SELECT_VALUE||"";

var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
var TEST=!!CFG.ENABLE_TEST_MODES,preview=TEST&&/[?&]preview\b/.test(location.search),debug=TEST&&/[?&]debug\b/.test(location.search);
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var norm=function(s){return String(s).replace(/\s+/g," ").trim()};
var d0=new Date(),today=d0.getFullYear()+"-"+String(d0.getMonth()+1).padStart(2,"0")+"-"+String(d0.getDate()).padStart(2,"0");
$("#yr").textContent=d0.getFullYear();

/* ---------- Form definitions (labels match the Google Forms exactly) ---------- */
var YN=["Yes","No"];
var F=function(id,label,type,o){return Object.assign({id:id,label:label,type:type||"text"},o||{})};
var R=function(id,l,opts,o){return F(id,l,"radio",Object.assign({opts:opts},o))};
var C=function(id,l,opts,o){return F(id,l,"check",Object.assign({opts:opts},o))};
var S=function(id,l,opts,o){return F(id,l,"select",Object.assign({opts:opts},o))};
var is=function(id,v){return function(g){return g(id)===v}};
var BILL=R("bill","Preferred Billing Model",["Prepaid","Postpaid"]);

var FORMS={
whatsapp:{tab:"WhatsApp",color:"#25d366",title:"WhatsApp Business API (WABA) Onboarding Questionnaire",secs:[
 ["Business Information",[F("email","Email","email",{auto:"email"}),F("co","Company / Business Name"),F("reg","Registered Business Name (as per legal documents)"),F("web","Business Website","url"),F("pc","Primary Business Contact Name"),F("mob","Mobile Number","tel",{auto:"tel"})]],
 ["Meta Business Account",[R("bm","Does the client already have a Meta Business Manager (Business Portfolio)?",YN),F("bmid","If Yes, please share the Business Manager (BM) ID","text",{show:is("bm","Yes")}),R("ver","Is the Meta Business Manager Business Verified?",["Yes","No","Under Review"]),R("adm","Does the client have Admin access to the Business Manager?",YN),R("fbp","Does the client have a Facebook Business Page?",YN),F("fbu","If Yes, please share the Facebook Page URL","url",{show:is("fbp","Yes")})]],
 ["WhatsApp Business Details",[R("waba","Does the client already have a WhatsApp Business Account (WABA)?",YN),R("use","Is the client currently using",["WhatsApp Business App","WhatsApp Business API","Personal WhatsApp"]),F("wan","WhatsApp Business Number","tel"),R("host","Is the WhatsApp number currently hosted with another BSP?",YN),S("bsp","If Yes, who is the current BSP?",["Karix","Gupshup","WATI","Interakt","Infobip","Netcore","Other"],{show:is("host","Yes")}),F("bspo","If \"Other\" BSP, please specify","text",{show:is("bsp","Other")}),R("mig","Does the client want to migrate the existing WhatsApp number to Paytm?",YN)]],
 ["Messaging Requirements",[C("mt","What type of messages does the client want to send?",["Marketing","Utility","Authentication (OTP)"])]],
 ["SMS / RCS Fallback",[R("f1","What should be the first fallback?",["SMS","RCS","Fallback not needed"]),R("f2","What should be the second fallback?",["RCS","SMS","Fallback not needed"])]],
 ["Commercial Information",[BILL]]]},
sms:{tab:"SMS",color:"#ffb547",title:"SMS Onboarding Questionnaire",secs:[
 ["Business Information",[F("email","Email","email",{auto:"email"}),F("co","Company / Business Name"),F("reg","Registered Business Name"),F("pc","Primary Contact Name"),F("mob","Mobile Number","tel",{auto:"tel"})]],
 ["DLT Registration",[R("dlt","Is the business registered on the DLT platform?",YN),F("pe","Principal Entity (PE) ID","text",{show:is("dlt","Yes")}),S("op","Which DLT operator is the business registered with?",["Airtel","Jio","Vodafone Idea (Vi)","BSNL","Smart Ping"])]],
 ["Sender ID (Header)",[R("has","Does the client already have approved Sender IDs (Headers)?",YN),F("sid","If yes, please provide the Sender ID(s) (Numeric & alphabetical both)","text",{show:is("has","Yes"),full:1}),F("ns","How many Sender IDs are required?","number")]],
 ["Messaging Requirements",[C("st","What type of SMS will be sent?",["OTP","Transactional","Promotional"])]],
 ["Integration Requirements",[S("trg","How will SMS be triggered?",["API","CSV upload","CRM - CleverTap, MoEngage, WebEngage etc."]),R("api","Does the client require API integration?",YN),R("dlr","Does the client require delivery reports (DLR)?",YN)]],
 ["Fallback & Multi-Channel Communication",[R("f1","What should be the first fallback?",["WhatsApp","RCS","Fallback not needed"]),R("f2","What should be the second fallback?",["RCS","WhatsApp","Fallback not needed"])]],
 ["Commercial Information",[F("go","Expected Go-Live Date","date"),BILL]]]},
rcs:{tab:"RCS",color:"#6b95ff",title:"RCS Business Messaging Onboarding Questionnaire",secs:[
 ["Basic Information",[F("email","Email","email",{auto:"email"}),F("sn","SPOC Name","text",{hint:"This will be used for RCS Activation LOA"}),F("sd","SPOC Designation","text",{hint:"This will be used for RCS Activation LOA"}),F("sm","SPOC Mobile Number","tel",{hint:"This will be used for RCS Activation LOA",auto:"tel"})]],
 ["Brand Information",[F("bn","Brand Name to be displayed on RCS"),F("ln","Legal Name of the Brand"),C("uc","Intended use case for RCS messaging",["Promotional","Transactional","OTP"]),F("an","Agent Name (Display Name)"),F("ad","Agent Description","textarea"),F("lg","Agent Logo - link to file (share PNG/JPG over email or paste a link - 224 px x 224px under 50kb)","url"),F("hr","Hero Image / Banner - link to file ( 1440 × 448 pixels, under 200kb, 45:14 aspect ratio)","url"),F("bc","Brand Colors (Hex Code)","hex",{hint:"For example #00B9F5"})]],
 ["Contact Information",[F("cp","Customer Support Phone Number","tel"),F("cpl","Display Label for Phone Number"),F("ce","Customer Support Email","email"),F("cel","Display Label for Email"),F("cw","Business Website URL","url"),F("cwl","Display Label for Website")]],
 ["Customer Consent (Opt-in)",[F("cons","How do you obtain customer consent before sending RCS messages?","textarea")]],
 ["Privacy & Compliance",[F("pp","Privacy Policy URL","url"),F("tc","Terms & Conditions URL","url")]],
 ["Testing Requirements",[F("tn","Please provide 5-10 RCS-enabled mobile numbers for testing","phones",{hint:"Separate numbers with commas or new lines"}),F("go","Expected Go-Live Date","date")]],
 ["Fallback Channels",[R("f1","What should be the first fallback?",["WhatsApp","SMS","Fallback not needed"]),R("f2","What should be the second fallback?",["SMS","WhatsApp","Fallback not needed"])]],
 ["Commercial Information",[BILL]]]}
};
var ORDER=["whatsapp","sms","rcs"];

/* ---------- Validation ---------- */
var URLRE=/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i;
function check(s,v){
 var empty=Array.isArray(v)?!v.length:!v;
 if(empty)return s.type==="check"?"Select at least one option.":s.type==="radio"?"Please select an option.":s.type==="select"?"Please choose an option.":"This field is required.";
 switch(s.type){
  case"email":return/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?"":"Enter a valid email address.";
  case"tel":var d=v.replace(/\D/g,"");return/^\+?[\d\s-]+$/.test(v)&&d.length>=10&&d.length<=15?"":"Enter a valid mobile number (10 to 15 digits).";
  case"url":return URLRE.test(v)?"":"Enter a valid link, for example https://example.com";
  case"hex":return/^#?[0-9a-f]{6}$/i.test(v)?"":"Enter a 6-digit hex code, for example #00B9F5.";
  case"number":return/^[1-9]\d{0,5}$/.test(v)?"":"Enter a whole number greater than 0.";
  case"date":return v>=today?"":"Choose today's date or a later date.";
  case"phones":var a=v.split(/[\n,;]+/).map(function(x){return x.trim()}).filter(Boolean);
   if(a.length<5||a.length>10)return"Enter 5 to 10 numbers, separated by commas or new lines.";
   return a.every(function(x){return check({type:"tel"},x)===""})?"":"One or more numbers are not valid.";
 }
 if(s.type==="text"&&v.length<2)return"Enter at least 2 characters.";
 if(s.type==="textarea"&&v.length<5)return"Please provide a little more detail.";
 return"";
}

/* ---------- Build UI ---------- */
var tabs=$("#tabs"),panels=$("#panels"),state={},active="";
function fieldHTML(key,s){
 var id=key+"-"+s.id,lab=esc(s.label)+'<span class="req" aria-hidden="true"> *</span>',
  hint=s.hint?'<p class="hint" id="'+id+'-h">'+esc(s.hint)+'</p>':"",
  err='<p class="err" id="'+id+'-e" role="alert"></p>';
 if(s.type==="radio"||s.type==="check"){
  var t=s.type==="radio"?"radio":"checkbox";
  return'<fieldset class="f full" data-id="'+s.id+'"><legend>'+lab+'</legend>'+hint+'<div class="opts">'+s.opts.map(function(o){return'<label class="opt"><input type="'+t+'" name="'+s.id+'" value="'+esc(o)+'"><span>'+esc(o)+'</span></label>'}).join("")+'</div>'+err+'</fieldset>';
 }
 var full=s.type==="textarea"||s.type==="phones"||s.full||s.label.length>58,
  dby=' aria-describedby="'+(s.hint?id+'-h ':"")+id+'-e"',ctl;
 if(s.type==="select")ctl='<select class="c" id="'+id+'" name="'+s.id+'"'+dby+'><option value="">Choose</option>'+s.opts.map(function(o){return'<option>'+esc(o)+'</option>'}).join("")+'</select>';
 else if(s.type==="textarea"||s.type==="phones")ctl='<textarea class="c" id="'+id+'" name="'+s.id+'" rows="4" maxlength="2000"'+dby+'></textarea>';
 else{
  var it=s.type==="email"?"email":s.type==="tel"?"tel":s.type==="date"?"date":"text",
   im=s.type==="url"?' inputmode="url"':s.type==="number"?' inputmode="numeric"':"",
   mn=s.type==="date"?' min="'+today+'"':"",ac=s.auto?' autocomplete="'+s.auto+'"':' autocomplete="off"';
  ctl='<input class="c" id="'+id+'" name="'+s.id+'" type="'+it+'"'+im+mn+ac+(it==='text'?' maxlength="300"':'')+dby+'>';
 }
 return'<div class="f'+(full?" full":"")+'" data-id="'+s.id+'"><label for="'+id+'">'+lab+'</label>'+hint+ctl+err+'</div>';
}
function build(key){
 var def=FORMS[key],specs=[],by={},secs=[];
 def.secs.forEach(function(sc){var list=sc[1];secs.push({t:sc[0],specs:list});list.forEach(function(s){specs.push(s);by[s.id]=s})});
 var map={};Object.keys(ENTRY[key]||{}).forEach(function(k){map[norm(k)]=ENTRY[key][k]});
 var html='<div class="formhead"><h2>'+esc(def.title)+'</h2><p><span class="req-note">*</span> All fields are required.</p></div>'+
  '<form novalidate data-key="'+key+'" id="panel-'+key+'" role="tabpanel" aria-labelledby="tab-'+key+'" hidden>'+
  secs.map(function(sc){return'<div class="sec"><h3>'+esc(sc.t)+'</h3><div class="grid">'+sc.specs.map(function(s){return fieldHTML(key,s)}).join("")+'</div></div>'}).join("")+
  '<div class="notice" role="alert" id="n-'+key+'">We could not submit your form right now. Please try again in a few minutes.</div>'+
  '<div class="actions"><button class="submit" type="submit"><span class="spin"></span><span class="lbl">Submit</span></button><span class="small">Your response goes to the Paytm Intelligence onboarding team.</span></div></form>';
 var wrap=document.createElement("section");wrap.className="fw";wrap.dataset.key=key;wrap.hidden=true;wrap.innerHTML=html;
 // formhead sits outside <form>; keep both inside wrapper
 panels.appendChild(wrap);
 var F_={key:key,el:$("form",wrap),box:wrap,specs:specs,by:by,secs:secs,map:map};
 state[key]=F_;
 F_.el.addEventListener("input",function(){refresh(F_)});
 F_.el.addEventListener("change",function(){refresh(F_)});
 F_.el.addEventListener("focusout",function(e){var w=e.target.closest&&e.target.closest("[data-id]");if(!w||w.classList.contains("hide"))return;var s=by[w.dataset.id];
  if(s.type==="radio"||s.type==="check")return;if(get(F_,s)||w.classList.contains("bad"))setErr(w,check(s,get(F_,s)))});
 F_.el.addEventListener("submit",function(e){submit(F_,e)});
 F_.el.hidden=false;
 var b=document.createElement("button");
 b.className="tab";b.type="button";b.setAttribute("role","tab");b.id="tab-"+key;b.style.setProperty("--c",def.color);b.setAttribute("aria-controls","panel-"+key);
 b.innerHTML="<i></i>"+esc(def.tab);b.addEventListener("click",function(){select(key)});
 b.addEventListener("keydown",function(e){var i=ORDER.indexOf(key),n=e.key==="ArrowRight"?i+1:e.key==="ArrowLeft"?i-1:null;if(n===null)return;e.preventDefault();n=(n+3)%3;select(ORDER[n]);$("#tab-"+ORDER[n]).focus()});
 tabs.appendChild(b);
}

/* ---------- State helpers ---------- */
function wrapOf(F_,s){return $('[data-id="'+s.id+'"]',F_.el)}
function get(F_,s){
 var w=wrapOf(F_,s);
 if(s.type==="radio"){var c=$("input:checked",w);return c?c.value:""}
 if(s.type==="check")return $$("input:checked",w).map(function(i){return i.value});
 return $(".c",w).value.trim();
}
function vis(F_,s){return!s.show||s.show(function(id){return get(F_,F_.by[id])})}
function setErr(w,m){w.classList.toggle("bad",!!m);$(".err",w).textContent=m;$$("input,select,textarea",w).forEach(function(c){m?c.setAttribute("aria-invalid","true"):c.removeAttribute("aria-invalid")})}
function refresh(F_){
 F_.specs.forEach(function(s){if(!s.show)return;var w=wrapOf(F_,s),v=vis(F_,s);w.classList.toggle("hide",!v);$$("input,select,textarea",w).forEach(function(c){c.disabled=!v});if(!v)setErr(w,"")});
 if(F_.key===active)paint(F_);
}
function paint(F_){
 var done=0,total=0,rows=F_.secs.map(function(sc){var ok=true;sc.specs.forEach(function(s){if(!vis(F_,s))return;total++;if(check(s,get(F_,s))==="")done++;else ok=false});return'<li class="'+(ok?"ok":"")+'"><b></b>'+esc(sc.t)+'</li>'}).join("");
 var pct=total?Math.round(done/total*100):0;
 $("#bar").style.width=pct+"%";$("#meter").setAttribute("aria-valuenow",pct);
 $("#count").textContent=done+" of "+total+" fields completed";$("#chk").innerHTML=rows;
}
function select(key){
 active=key;$$(".tn button").forEach(function(b){b.setAttribute("aria-current",b.dataset.k===key)});
 ORDER.forEach(function(k){var on=k===key;state[k].box.hidden=!on;var t=$("#tab-"+k);t.setAttribute("aria-selected",on);t.tabIndex=on?0:-1});
 refresh(state[key]);
}

/* ---------- Submit ---------- */
function submit(F_,e){
 e.preventDefault();
 var first=null,btn=$(".submit",F_.el),note=$("#n-"+F_.key);note.classList.remove("on");
 F_.specs.forEach(function(s){var w=wrapOf(F_,s);if(!vis(F_,s)){setErr(w,"");return}var m=check(s,get(F_,s));setErr(w,m);if(m&&!first)first=w});
 if(first){first.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"});var c=$("input,select,textarea",first);if(c)c.focus({preventScroll:true});return}

 var p=new URLSearchParams(),miss=[];
 F_.specs.forEach(function(s){
  var shown=vis(F_,s),v=shown?get(F_,s):"N/A",key=s.id==="email"&&F_.specs[0].id==="email"?"emailAddress":F_.map[norm(s.label)];
  if(!shown&&s.type==="select"){if(!HIDDEN_SELECT_VALUE)return;v=HIDDEN_SELECT_VALUE}
  if(!key){miss.push(s.label);return}
  if(s.type==="date"){var d=v.split("-");p.append(key+"_year",d[0]);p.append(key+"_month",d[1]);p.append(key+"_day",d[2])}
  else if(Array.isArray(v)){v.forEach(function(x){p.append(key,x)});p.append(key+"_sentinel","")}
  else p.append(key,v);
 });
 p.append("fvv","1");p.append("pageHistory","0");
 btn.disabled=true;$(".lbl",btn).textContent="Submitting";

 if(debug){/* opens Google's own response page in a new tab so you can read its exact message */
  var act="https://docs.google.com/forms/d/e/"+FORM_IDS[F_.key]+"/formResponse",f=document.createElement("form");
  f.method="POST";f.action=act;f.target="_blank";f.style.display="none";
  p.forEach(function(v,k){var i=document.createElement("input");i.type="hidden";i.name=k;i.value=v;f.appendChild(i)});
  document.body.appendChild(f);f.submit();f.remove();btn.disabled=false;$(".lbl",btn).textContent="Submit";return}

 var send;
 if(preview)send=new Promise(function(r){setTimeout(r,700)});
 else if(miss.length){console.error("Onboarding form is missing Google Form entry IDs for:",miss);send=Promise.reject(new Error("config"))}
 else send=fetch("https://docs.google.com/forms/d/e/"+FORM_IDS[F_.key]+"/formResponse",{method:"POST",mode:"no-cors",body:p});

 send.then(function(){
  var dlg=$("#done");typeof dlg.showModal==="function"?dlg.showModal():dlg.setAttribute("open","");$("#ok").focus();
 }).catch(function(){note.classList.add("on");note.scrollIntoView({block:"center"})})
 .then(function(){btn.disabled=false;$(".lbl",btn).textContent="Submit"});
}

/* ---------- Reset after confirmation ---------- */
function resetAll(){
 ORDER.forEach(function(k){var F_=state[k];F_.el.reset();F_.specs.forEach(function(s){setErr(wrapOf(F_,s),"")});$("#n-"+k).classList.remove("on");refresh(F_)});
 select("whatsapp");window.scrollTo({top:0,behavior:"auto"});
}
$("#ok").addEventListener("click",function(){var d=$("#done");d.close?d.close():d.removeAttribute("open");resetAll()});
$("#done").addEventListener("close",resetAll);
$("#done").addEventListener("click",function(e){if(e.target===this)this.close()});

ORDER.forEach(build);
ORDER.forEach(function(k){var F_=state[k],m=F_.specs.filter(function(s){return!(s.id==="email"&&F_.specs[0].id==="email")&&!F_.map[norm(s.label)]}).map(function(s){return s.label});
 if(m.length&&!preview)console.warn("[Onboarding] "+FORMS[k].tab+" form: Google entry IDs missing for "+m.length+" field(s). Submissions will not be sent until they are added to ENTRY."+k,m)});
select("whatsapp");
})();

/* Header menu, logo, motion preference and one-time welcome dialog */
(function(){
"use strict";
var LOGO_SRC=(window.PI_CONFIG&&window.PI_CONFIG.LOGO_SRC)||"";
document.querySelectorAll(".tn button").forEach(function(b){b.addEventListener("click",function(){document.getElementById("tab-"+b.dataset.k).click();document.getElementById("tabs").scrollIntoView({behavior:"smooth",block:"center"})})});
(function(){
 var l=document.getElementById("logo");
 if(LOGO_SRC){var i=new Image();i.alt="Pi by Paytm";i.onload=function(){l.removeAttribute("role");l.removeAttribute("aria-label");l.innerHTML="";l.appendChild(i)};i.src=LOGO_SRC}
 if(matchMedia("(prefers-reduced-motion: reduce)").matches){var v=document.querySelector(".scene");if(v&&v.pauseAnimations)v.pauseAnimations()}
})();
(function(){
 var KEY="pi_onboarding_welcome_seen_v1",seen=false;
 try{seen=localStorage.getItem(KEY)==="1"}catch(e){}
 if(seen)return;
 var d=document.getElementById("welcome");if(!d)return;
 function close(){if(d.close)d.close();else d.removeAttribute("open");var t=document.getElementById("tab-whatsapp");if(t)t.focus({preventScroll:true})}
 document.getElementById("wgo").addEventListener("click",close);
 d.addEventListener("click",function(e){if(e.target===d)close()});
 setTimeout(function(){
  try{localStorage.setItem(KEY,"1")}catch(e){}
  if(typeof d.showModal==="function")d.showModal();else d.setAttribute("open","");
  document.getElementById("wgo").focus();
 },500);
})();
})();
