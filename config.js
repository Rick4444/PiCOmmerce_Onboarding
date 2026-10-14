/* =====================================================================
   Site configuration. This is the only file you normally need to edit.
   ===================================================================== */
window.PI_CONFIG = {

  /* Google Form IDs (the long id in each form's /d/e/<ID>/viewform link). */
  FORM_IDS: {
 whatsapp:"1FAIpQLSeq3l4bwxuwrKzv3uyd41Q6I0psj2qIfIrtVidiZFDZNCve1g",
 sms:"1FAIpQLSe--_aUL5tuKkhT-QAm9EBdMkeMoT2MhWnzyuVFHyjmdzGGZA",
 rcs:"1FAIpQLSe_mOQN8QG96_nY3Rp1ni7QozbHjdCIEquMnbcbrNERWZTmFw"
},

  /* Google Form field IDs, keyed by the exact question title.
     To generate each map, open the form in Chrome, press F12, choose Console and run:
     JSON.stringify(Object.fromEntries(FB_PUBLIC_LOAD_DATA_[1][1].filter(q=>q[4]).map(q=>[q[1],'entry.'+q[4][0][0]])))
     then paste the result in place of the empty braces below. */
  ENTRY: {
 whatsapp:{"Company / Business Name":"entry.112259589","Registered Business Name (as per legal documents)":"entry.287668990","Business Website":"entry.670929133","Primary Business Contact Name":"entry.1139826974","Mobile Number":"entry.2020492281","Does the client already have a Meta Business Manager (Business Portfolio)?":"entry.855145642","If Yes, please share the Business Manager (BM) ID":"entry.294314656","Is the Meta Business Manager Business Verified?":"entry.1356532702","Does the client have Admin access to the Business Manager?":"entry.589524255","Does the client have a Facebook Business Page?":"entry.1516019892","If Yes, please share the Facebook Page URL":"entry.1696812981","Does the client already have a WhatsApp Business Account (WABA)?":"entry.1938351922","Is the client currently using":"entry.805544681","WhatsApp Business Number":"entry.1799530978","Is the WhatsApp number currently hosted with another BSP?":"entry.1674763407","If Yes, who is the current BSP?":"entry.1457522873","If \"Other\" BSP, please specify":"entry.702039843","Does the client want to migrate the existing WhatsApp number to Paytm?":"entry.1769749635","What type of messages does the client want to send?":"entry.453605345","What should be the first fallback?":"entry.459597121","What should be the second fallback?":"entry.738972211","Preferred Billing Model":"entry.706967061"},
 sms:{},
 rcs:{}
},

  /* If a dropdown that only appears after a "Yes" answer is REQUIRED in the Google Form
     (WhatsApp: "If Yes, who is the current BSP?"), Google rejects the response when it is hidden.
     Best fix: make that question optional in Google Forms. Alternative: add an option such as
     "Not applicable" to the dropdown and put that exact text here. */
  HIDDEN_SELECT_VALUE: "",

  /* Optional: path or URL of the official Pi logo (for example "img/pi-logo.svg").
     Leave empty to show the built-in Pi wordmark. */
  LOGO_SRC: "",

  /* Set to true only while testing. Then:
       ?preview  simulates a successful submit without sending anything
       ?debug    opens Google's real response page in a new tab so you can read its message
     Keep false for the live site. */
  ENABLE_TEST_MODES: false
};
