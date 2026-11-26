// Form definitions for the LBCO Digital Safety App.
// Field types: text, textarea, date, time, select, yesno, checklist, number, signature
const yn = { type: "yesno" };
const base = [
  { id: "date", label: "Date", type: "date", auto: "today" },
  { id: "site", label: "Work site", type: "select", source: "sites" },
  { id: "name", label: "Completed by", type: "text" },
];
const sign = { id: "signature", label: "Signature (type full name)", type: "signature" };

const checks = (items) => ({ id: "checks", label: "Checklist", type: "checklist", items });

window.FORMS = {
  signin: {
    title: "Work Site Sign In",
    fields: [...base,
      { id: "company", label: "Company", type: "text" },
      { id: "timein", label: "Time in", type: "time" },
      { id: "timeout", label: "Time out", type: "time" },
      { id: "task", label: "Work being performed", type: "textarea" }, sign],
  },
  orientation: {
    title: "Site Safety Orientation",
    fields: [...base,
      { id: "worker", label: "Worker / visitor name", type: "text" },
      { id: "employer", label: "Employer", type: "text" },
      checks(["Emergency muster point reviewed", "First aid location reviewed", "Site hazards reviewed",
        "PPE requirements reviewed", "Reporting incidents and near misses", "Right to refuse unsafe work"]),
      sign],
  },
  hazard: {
    title: "eHazard Assessment",
    fields: [...base,
      { id: "task", label: "Task / work area", type: "textarea" },
      checks(["Overhead hazards", "Underground utilities", "Traffic / equipment interaction",
        "Slips, trips and falls", "Excavation / trench", "Weather conditions", "Noise / dust / silica", "Working alone"]),
      { id: "controls", label: "Controls in place", type: "textarea" },
      { id: "risk", label: "Residual risk", type: "select", options: ["Low", "Medium", "High"] }, sign],
  },
  equipment: {
    title: "Powered Mobile Equipment Check",
    fields: [...base,
      { id: "unit", label: "Unit / equipment number", type: "text" },
      { id: "hours", label: "Hours / odometer", type: "number" },
      checks(["Fluid levels", "Tires / tracks", "Lights and signals", "Backup alarm", "Horn", "Brakes",
        "Steering", "Seat belt", "Fire extinguisher", "Mirrors / cameras", "Guards in place", "Hydraulic leaks"]),
      { id: "defects", label: "Defects noted", type: "textarea" },
      { id: "safe", label: "Safe to operate?", ...yn }, sign],
  },
  meeting: {
    title: "Safety Meeting",
    fields: [...base,
      { id: "topic", label: "Topic", type: "text" },
      { id: "notes", label: "Discussion notes", type: "textarea" },
      { id: "attendees", label: "Attendees (one per line)", type: "textarea" }, sign],
  },
  security: {
    title: "Site Security Checks",
    fields: [...base,
      { id: "time", label: "Time of check", type: "time" },
      checks(["Gates / fencing secure", "Equipment locked", "Fuel / materials secured", "Lighting working", "Signage in place"]),
      { id: "issues", label: "Issues found", type: "textarea" }, sign],
  },
  incident: {
    title: "Incident Reporting & Investigation",
    fields: [...base,
      { id: "type", label: "Type", type: "select", options: ["Injury", "Near miss", "Property damage", "Environmental", "Vehicle", "Other"] },
      { id: "when", label: "Time of incident", type: "time" },
      { id: "people", label: "People involved", type: "textarea" },
      { id: "desc", label: "What happened", type: "textarea" },
      { id: "firstaid", label: "First aid / medical given", type: "textarea" },
      { id: "cause", label: "Root cause", type: "textarea" },
      { id: "actions", label: "Corrective actions", type: "textarea" }, sign],
  },
  inspection: {
    title: "Work Site Inspections",
    fields: [...base,
      checks(["Housekeeping", "Traffic control", "Excavations / shoring", "PPE use", "Fire extinguishers", "First aid kit",
        "Signage / barricades", "Electrical / cords", "Chemical storage", "Emergency plan posted"]),
      { id: "deficiencies", label: "Deficiencies and actions", type: "textarea" }, sign],
  },
  eco: {
    title: "ECO Inspections",
    fields: [...base,
      checks(["Erosion and sediment controls intact", "Spill kit available", "Fuel storage contained", "Dust control",
        "Waste managed", "Dewatering controlled", "Wildlife / vegetation protected"]),
      { id: "notes", label: "Notes and corrective actions", type: "textarea" }, sign],
  },
  esc: {
    title: "ESC Inspections",
    fields: [...base,
      checks(["Silt fence", "Inlet protection", "Track-out controlled", "Stockpiles covered", "Slopes stabilised", "Outlets clear"]),
      { id: "rain", label: "Recent rainfall event?", ...yn },
      { id: "notes", label: "Notes and corrective actions", type: "textarea" }, sign],
  },
  signs: {
    title: "Construction Signs Inspection",
    fields: [...base,
      checks(["Signs visible and clean", "Correct sign placement", "Cones / barrels in place", "Flagging / lighting working",
        "Detour signs correct", "Obsolete signs covered"]),
      { id: "notes", label: "Notes", type: "textarea" }, sign],
  },
  drill: {
    title: "Emergency Response Drill",
    fields: [...base,
      { id: "scenario", label: "Scenario", type: "select", options: ["Fire", "Medical", "Utility strike", "Spill", "Trench rescue", "Other"] },
      { id: "participants", label: "Participants", type: "textarea" },
      { id: "response", label: "Response time (minutes)", type: "number" },
      { id: "went", label: "What went well / improvements", type: "textarea" }, sign],
  },
  gdp: {
    title: "Ground Disturbance Permit",
    fields: [...base,
      { id: "loc", label: "Location / description of work", type: "textarea" },
      { id: "onecall", label: "Utility locate / Alberta One-Call ticket #", type: "text" },
      checks(["Utilities located and marked", "Hand exposure required", "Locates reviewed with crew", "Spotter assigned",
        "Emergency numbers on site"]),
      { id: "valid", label: "Valid until", type: "date" }, sign],
  },
  csp: {
    title: "Confined Space Permit",
    fields: [...base,
      { id: "space", label: "Space identification", type: "text" },
      { id: "o2", label: "Oxygen %", type: "number" },
      { id: "lel", label: "LEL %", type: "number" },
      { id: "h2s", label: "H2S ppm", type: "number" },
      { id: "co", label: "CO ppm", type: "number" },
      checks(["Isolation / lockout complete", "Ventilation provided", "Attendant assigned", "Rescue plan in place",
        "Communication established", "Entrants trained"]),
      { id: "entrants", label: "Entrants", type: "textarea" }, sign],
  },
  hotwork: {
    title: "Hot Work Permit",
    fields: [...base,
      { id: "work", label: "Work description", type: "textarea" },
      checks(["Combustibles removed / covered", "Fire extinguisher at hand", "Fire watch assigned", "Gas test done if required",
        "Post-work watch period set"]),
      { id: "valid", label: "Valid until (time)", type: "time" }, sign],
  },
  height: {
    title: "Working at Height",
    fields: [...base,
      { id: "height", label: "Working height (m)", type: "number" },
      { id: "method", label: "Access method", type: "select", options: ["Ladder", "Scaffold", "Aerial lift", "Roof", "Other"] },
      checks(["Anchor points identified", "Harness inspected", "Rescue plan reviewed", "Area below barricaded"]),
      sign],
  },
  fallplan: {
    title: "Fall Protection Plan",
    fields: [...base,
      { id: "scope", label: "Scope of work", type: "textarea" },
      { id: "hazards", label: "Fall hazards", type: "textarea" },
      { id: "systems", label: "Fall protection systems used", type: "textarea" },
      { id: "rescue", label: "Rescue procedure", type: "textarea" }, sign],
  },
  harness: {
    title: "Harness Inspection",
    fields: [...base,
      { id: "serial", label: "Harness serial #", type: "text" },
      checks(["Webbing free of cuts / fraying", "Stitching intact", "Buckles / D-rings undamaged", "Labels legible",
        "Lanyard / SRL functional", "No chemical damage"]),
      { id: "pass", label: "Pass?", ...yn }, sign],
  },
  scaffold: {
    title: "Scaffold Inspection",
    fields: [...base,
      { id: "loc", label: "Scaffold location", type: "text" },
      checks(["Base plates / mud sills", "Plumb and level", "Bracing", "Planking complete", "Guardrails", "Access ladder",
        "Tied to structure", "Tag current"]),
      { id: "safe", label: "Safe to use?", ...yn }, sign],
  },
  contractor: {
    title: "Contractor Orientation",
    fields: [...base,
      { id: "company", label: "Contractor company", type: "text" },
      { id: "wcb", label: "WCB clearance in good standing?", ...yn },
      { id: "cor", label: "COR / safety program on file?", ...yn },
      checks(["Site rules reviewed", "Emergency plan reviewed", "Incident reporting reviewed", "PPE requirements reviewed"]),
      sign],
  },
  warning: {
    title: "Written Warning",
    fields: [...base,
      { id: "employee", label: "Employee", type: "text" },
      { id: "issue", label: "Safety violation / issue", type: "textarea" },
      { id: "prior", label: "Prior discussion / warnings", type: "textarea" },
      { id: "expect", label: "Expectations going forward", type: "textarea" }, sign],
  },
  mgmt: {
    title: "Management Safety Reports",
    fields: [...base,
      { id: "period", label: "Reporting period", type: "text" },
      { id: "incidents", label: "Incidents / near misses", type: "number" },
      { id: "inspections", label: "Inspections completed", type: "number" },
      { id: "summary", label: "Summary and follow-up", type: "textarea" }, sign],
  },
  support: {
    title: "Technical Support Request",
    fields: [
      { id: "date", label: "Date", type: "date", auto: "today" },
      { id: "name", label: "Your name", type: "text" },
      { id: "issue", label: "Describe the problem", type: "textarea" }],
  },
  feature: {
    title: "App New Feature Request",
    fields: [
      { id: "date", label: "Date", type: "date", auto: "today" },
      { id: "name", label: "Your name", type: "text" },
      { id: "feature", label: "Requested feature", type: "textarea" }],
  },
};

// Home page layout. kind: form | doc | admin
window.SHAREPOINT_URL = "https://netorg261134.sharepoint.com/Shared%20Documents/LBCO%20Safety%20App";
window.REPORTS = {
  signin: { title: "Work Site Sign-In Summary", src: "https://www.jotform.com/report/25011131371203412" },
  hazards: { title: "Hazard Assessment Summary", src: "https://www.jotform.com/report/25011225037203712" },
  orientations: { title: "Orientations", src: "https://www.jotform.com/report/25011412904504112" },
  fall: { title: "Fall Protection Reports", src: "https://www.jotform.com/report/25011216051703812" },
  harness: { title: "Harness Inspection Reports", src: "https://www.jotform.com/report/25011321431203212" },
  hotwork: { title: "Hot Work Reports", src: "https://www.jotform.com/report/25011311176403912" },
  pme: { title: "PME Reports", src: "https://www.jotform.com/report/25011294818004812" },
  csp: { title: "Confined Space Reports", src: "https://www.jotform.com/report/25020564338705221" },
};
window.MENU = {
  top: [{ label: "Management Safety Reports", form: "mgmt" }],
  columns: [
    { title: "Daily Forms", items: [
      { label: "Work Site Sign In", form: "signin" },
      { label: "Site Safety Orientation", form: "orientation" },
      { label: "eHazard Assessment", form: "hazard" },
      { label: "Powered Mobile Equipment Check", form: "equipment" },
      { label: "Safety Meeting", form: "meeting" },
      { label: "Site Security Checks", form: "security" }] },
    { title: "Inspections", items: [
      { label: "Incident Reporting & Investigation", form: "incident" },
      { label: "Work Site Inspections", form: "inspection" },
      { label: "ECO Inspections", form: "eco" },
      { label: "ESC Inspections", form: "esc" },
      { label: "Construction Signs Inspection", form: "signs" },
      { label: "Emergency Response Drill", form: "drill" }] },
    { title: "Permits", items: [
      { label: "Ground Disturbance Permit", form: "gdp" },
      { label: "Confined Space Permit", form: "csp" },
      { label: "Hot Work Permit", form: "hotwork" },
      { label: "Working at Height", form: "height" },
      { label: "Fall Protection Plan", form: "fallplan" },
      { label: "Harness Inspection", form: "harness" },
      { label: "Scaffold Inspection", form: "scaffold" }] },
    { title: "Employee Management", items: [
      { label: "Contractor Orientation", form: "contractor" },
      { label: "Written Warning", form: "warning" },
      { label: "Safe Job Procedures", doc: "sjp" },
      { label: "Health & Safety Manual", doc: "manual" },
      { label: "OHS Legislation", doc: "ohs" }] },
    { title: "Dashboard", items: [
      { label: "Work Site Sign-In Summary", report: "signin" },
      { label: "Hazard Assessment Summary", report: "hazards" },
      { label: "Orientations", report: "orientations" },
      { label: "Fall Protection Reports", report: "fall" },
      { label: "Harness Inspection Reports", report: "harness" },
      { label: "Hot Work Reports", report: "hotwork" },
      { label: "PME Reports", report: "pme" },
      { label: "Confined Space Reports", report: "csp" },
      { label: "SharePoint Safety Folder", url: window.SHAREPOINT_URL }] },
    { title: "App Admin", items: [
      { label: "Add New Work Site", admin: "addsite" },
      { label: "Technical Support Request", form: "support" },
      { label: "App New Feature Request", form: "feature" },
      { label: "Update/Delete Existing Work Sites", admin: "sites" }] },
  ],
};

// Forms that also exist in the LBCO Jotform account. Matching menu forms open the Jotform form (embedded);
// everything else keeps using the built-in form. Remove an entry to go back to the built-in version.
window.JOTFORM = {
  signin: "262366866132058",      // Work Site Sign In
  orientation: "263286461245056", // Site Safety Orientation
  hazard: "262305952841256",      // eHazard Assessment
  equipment: "262367325130047",   // Powered Mobile Equipment Check
  meeting: "263286863328064",     // Safety Meeting
  security: "263286441467060",    // Site Security Checks
  incident: "263286282489067",    // Incident Reporting & Investigation
  inspection: "263286342242051",  // Work Site Inspections
  eco: "263286655584067",         // ECO Inspections
  esc: "263286157686067",         // ESC Inspections
  signs: "263286184411053",       // Construction Signs Inspection
  drill: "263286468063061",       // Emergency Response Drill
  contractor: "263026069664057",  // Contractor Orientation
  gdp: "263294793145062",         // Ground Disturbance Permit
  csp: "263295462041051",         // Confined Space Permit
  hotwork: "263294943118059",     // Hot Work Permit
  fallplan: "263294688500060",    // Fall Protection Plan
  harness: "263295255996070",     // Harness Inspection
  scaffold: "263295130521046",    // Scaffold Inspection
  // warning: "262936036296061",  // Written Warning (Jotform form is currently disabled - turn it on, then uncomment)
};

// App Admin items that open an LBCO Jotform form (embedded) instead of the built-in screen.
// Remove an entry to go back to the built-in work site screen.
window.ADMIN_JOTFORM = {
  addsite: "263294979797081", // Add New Work Site  (LBCO Add Work Site)
  sites: "263295660509060",   // Update/Delete Existing Work Sites  (LBCO Update / Delete Existing Worksites Request)
};

// Default links for the document buttons (used until a link is saved in the browser).
window.DOC_URLS = {
  sjp: "https://netorg261134.sharepoint.com/Shared%20Documents/LBCO%20Safety%20App/Safety%20Documents",
  manual: "https://netorg261134.sharepoint.com/Shared%20Documents/LBCO%20Safety%20App/Safety%20Documents",
};
