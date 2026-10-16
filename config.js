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
 sms: {"Company / Business Name": "entry.1121921123", "Registered Business Name": "entry.715844873", "Primary Contact Name": "entry.919389757", "Mobile Number": "entry.2082082126", "Is the business registered on the DLT platform?": "entry.509318369", "Principal Entity (PE) ID": "entry.1056004979", "Which DLT operator is the business registered with?": "entry.1013786071", "Does the client already have approved Sender IDs (Headers)?": "entry.1387254703", "If yes, please provide the Sender ID(s) (Numeric & alphabetical both)": "entry.1306954256", "How many Sender IDs are required?": "entry.1818367933", "What type of SMS will be sent?": "entry.1945829888", "How will SMS be triggered?": "entry.302930398", "Does the client require API integration?": "entry.1989208819", "Does the client require delivery reports (DLR)?": "entry.60534967", "What should be the first fallback?": "entry.609623241", "What should be the second fallback?": "entry.1453462773", "Expected Go-Live Date": "entry.1677226622", "Preferred Billing Model": "entry.1972404206"},
 rcs: {"SPOC Name": "entry.1118606435", "SPOC Designation": "entry.1679670574", "SPOC Mobile Number": "entry.485470669", "Brand Name to be displayed on RCS": "entry.1635592091", "Legal Name of the Brand": "entry.154482033", "Intended use case for RCS messaging": "entry.132707126", "Agent Name (Display Name)": "entry.1095739474", "Agent Description": "entry.696298638", "Agent Logo - link to file (share PNG/JPG over email or paste a link - 224 px x 224px under 50kb)": "entry.795667415", "Hero Image / Banner - link to file ( 1440 × 448 pixels, under 200kb, 45:14 aspect ratio)": "entry.1858772363", "Brand Colors (Hex Code)": "entry.1819416538", "Customer Support Phone Number": "entry.1219833206", "Display Label for Phone Number": "entry.769174957", "Customer Support Email": "entry.146806301", "Display Label for Email": "entry.2061627988", "Business Website URL": "entry.801131581", "Display Label for Website": "entry.1694530686", "How do you obtain customer consent before sending RCS messages?": "entry.1642769548", "Privacy Policy URL": "entry.1420652932", "Terms & Conditions URL": "entry.492840082", "Please provide 5-10 RCS-enabled mobile numbers for testing": "entry.418580433", "Expected Go-Live Date": "entry.702577441", "What should be the first fallback?": "entry.782590551", "What should be the second fallback?": "entry.1175554073", "Preferred Billing Model": "entry.661321868"}
},

  /* If a dropdown that only appears after a "Yes" answer is REQUIRED in the Google Form
     (WhatsApp: "If Yes, who is the current BSP?"), Google rejects the response when it is hidden.
     Best fix: make that question optional in Google Forms. Alternative: add an option such as
     "Not applicable" to the dropdown and put that exact text here. */
  HIDDEN_SELECT_VALUE: "",

  /* Optional: path or URL of the official Pi logo (for example "img/pi-logo.svg").
     Leave empty to show the built-in Pi wordmark. */
  LOGO_SRC: "",

  /* Where each form sends its answers:
       "sheet"  directly into a Google Sheet (needs SHEET_URL, see whatsapp-sheet-apps-script.gs)
       "form"   the original Google Form (uses FORM_IDS and ENTRY above) */
  TARGETS: { whatsapp: "form", sms: "form", rcs: "form" },

  /* Web app URL (ends in /exec) of whatsapp-sheet-apps-script.gs. Only used when a form is set to "sheet" above. */
  SHEET_URL: "https://script.google.com/macros/s/AKfycbzIZTchcvucKQ9Yz9TLvQ5AxeAubCqrcTqqdZojKXa9IRz7_FfprtbVP2JyMmvBMHlx/exec",

  /* RCS image upload. Web-app URL of the upload script (see upload-apps-script.gs and README).
     Leave empty and customers can still paste a link, but the Upload option will report that it is unavailable. */
  UPLOAD_URL: "",

  /* Checks applied to uploaded RCS images (JPG / JPEG only is always enforced).
     Remove a number to stop checking it. */
  IMAGE_RULES: {
    logo: { width: 224,  height: 224, maxKB: 50  },
    hero: { width: 1440, height: 448, maxKB: 200 }
  },

  /* Set to true only while testing. Then:
       ?preview  simulates a successful submit without sending anything
       ?debug    opens Google's real response page in a new tab so you can read its message
     Keep false for the live site. */
  ENABLE_TEST_MODES: false
};
