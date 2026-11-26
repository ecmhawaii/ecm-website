/**
 * ECM lead log (Google Apps Script, bound to the lead log Google Sheet). Code only: no URLs,
 * keys or lead data live in the repo. Setup: ops/lead-log/README.md.
 *
 * What it does
 *  - doPost: receives Netlify's outgoing webhook for the estimate, contact and checklist-request
 *    forms (?k=WEBHOOK_KEY), ignores the subcontractor form, dedupes by Netlify ID, appends a row
 *    to Leads and emails each teammate their own Claim link.
 *  - doGet: the Claim page (first name, project type, Claim button). The button POSTs through
 *    google.script.run, so email scanners that prefetch links can never claim. Links are signed
 *    with an HMAC per lead per person. First claim wins.
 *  - onEdit: ticking "Log touch" counts a touch and sets the next one from the Cadence tab.
 *    Changing Status starts that status's cadence.
 *  - Triggers (setupTriggers): nudge every 5 minutes and daily digest at 07:00, both only on
 *    the Settings tab's "Response days" (default Mon to Sat); weekly summary Monday 07:00
 *    (Hawaii time).
 *  - Flood cap: past "Max claim emails per hour" (Settings, default 10 leads an hour), rows are
 *    still added but claim emails stop, and one alert goes to both people (at most once an hour).
 *
 * Script Properties (Project Settings > Script Properties). Never in code:
 *   WEBHOOK_KEY          long random string; the Netlify webhook URL ends with ?k=<it>
 *   CLAIM_SECRET         long random string used to sign Claim links
 *   TEAM_1_NAME, TEAM_1_EMAIL, TEAM_2_NAME, TEAM_2_EMAIL   the two people leads go to
 *   SITE_URL             the live site origin, for the step counter report
 *   FUNNEL_REPORT_TOKEN  same value as FUNNEL_REPORT_TOKEN in Netlify
 *   WEB_APP_URL          optional; the deployed web app URL (defaults to this deployment's URL)
 *
 * Privacy: lead data is never written to Logger or console. IP address, user agent and referrer
 * from Netlify's payload are not stored.
 */

var TZ = 'Pacific/Honolulu';
var SHEETS = { leads: 'Leads', cadence: 'Cadence', settings: 'Settings' };
var LEAD_HEADERS = [
  'Received (HST)', 'Netlify ID', 'Form', 'Lead type', 'Name', 'Phone', 'Email', 'Island',
  'Project type', 'Details', 'Heard about', 'Source page', 'Text OK', 'Email OK', 'Owner',
  'Claimed at', 'First contact at', 'Minutes to claim', 'Status', 'Touches', 'Last touch',
  'Next touch', 'Log touch', 'Outcome reason', 'Notes',
];
var STATUSES = ['New', 'Contacted', 'Site visit booked', 'Proposal sent', 'Won', 'Lost', 'Nurture'];
var ACTIVE = ['New', 'Contacted', 'Site visit booked', 'Proposal sent', 'Nurture'];
var LEAD_FORMS = ['estimate', 'contact', 'checklist-request'];
var DAY_NAMES = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']; // Utilities.formatDate 'u': 1 Monday .. 7 Sunday
var SETTINGS_ROWS = [
  ['Nudge after (minutes)', 15],
  ['Nudge window start (hour, HST)', 7],
  ['Nudge window end (hour, HST)', 19],
  ['Response days', 'Mon to Sat'],
  ['Max claim emails per hour', 10],
  ['Secrets', 'Kept in Script Properties, never on this sheet.'],
  ['Time zone', TZ],
];
var FLOOD_ALERT = 'Unusual number of leads in the last hour, check the lead log';
var CADENCE_HEADERS = ['Status', 'Day offsets', 'Then every (days)', 'Repeat times (0 = no limit)', 'After that, set status', 'Counts from', 'Notes'];
var DEFAULT_CADENCE = [
  ['New', '0, 1, 3, 5, 7', 30, 3, 'Nurture', 'Received', 'Day 3: useful email with a guide or checklist link. Day 7: close the loop. Then monthly for 3 months, then Nurture.'],
  ['Contacted', '0, 1, 3, 5, 7', 30, 3, 'Nurture', 'Received', 'Same sequence as New (counts from when the lead came in).'],
  ['Proposal sent', '2, 5, 10', 14, 0, '', 'Status change', 'Day 2, 5, 10 after the proposal, then every 14 days.'],
  ['Nurture', '1b, 7', 30, 0, '', 'Status change', '1b = one business day: personal email. Then day 7, then monthly.'],
  ['Site visit booked', '', '', '', '', 'Status change', 'No automatic touches. Set Next touch by hand if needed.'],
  ['Won', '', '', '', '', 'Status change', 'No touches.'],
  ['Lost', '', '', '', '', 'Status change', 'No touches. Fill in Outcome reason.'],
];

/* ------------------------------------------------------------------ setup */

/** Run once from the editor: creates the three tabs, headers, dropdowns and default cadence. */
function setupSheet() {
  var ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone(TZ);
  var leads = ss.getSheetByName(SHEETS.leads) || ss.insertSheet(SHEETS.leads);
  if (leads.getLastRow() === 0) leads.appendRow(LEAD_HEADERS);
  leads.setFrozenRows(1);
  leads.getRange(1, 1, 1, LEAD_HEADERS.length).setFontWeight('bold');
  var c = cols_(leads);
  var maxRows = Math.max(leads.getMaxRows() - 1, 1);
  leads.getRange(2, c['Status'], maxRows, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build());
  leads.getRange(2, c['Log touch'], maxRows, 1).insertCheckboxes();
  ['Received (HST)', 'Claimed at', 'First contact at', 'Last touch', 'Next touch'].forEach(function (h) {
    leads.getRange(2, c[h], maxRows, 1).setNumberFormat('yyyy-mm-dd hh:mm');
  });

  var cad = ss.getSheetByName(SHEETS.cadence) || ss.insertSheet(SHEETS.cadence);
  if (cad.getLastRow() === 0) {
    cad.appendRow(CADENCE_HEADERS);
    cad.getRange(2, 1, DEFAULT_CADENCE.length, CADENCE_HEADERS.length).setValues(DEFAULT_CADENCE);
    cad.setFrozenRows(1);
    cad.getRange(1, 1, 1, CADENCE_HEADERS.length).setFontWeight('bold');
  }

  var set = ss.getSheetByName(SHEETS.settings) || ss.insertSheet(SHEETS.settings);
  if (set.getLastRow() === 0) {
    set.appendRow(['Setting', 'Value']);
    set.getRange(1, 1, 1, 2).setFontWeight('bold');
  }
  // Adds any missing setting with its default (safe to run again on an existing sheet).
  var have = set.getDataRange().getValues().map(function (r) { return String(r[0]); });
  SETTINGS_ROWS.forEach(function (row) { if (have.indexOf(row[0]) === -1) set.appendRow(row); });
}

/** Run once from the editor: installs the three time based triggers (Hawaii time). */
function setupTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (['nudgeUnclaimed', 'dailyDigest', 'weeklySummary'].indexOf(t.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('nudgeUnclaimed').timeBased().everyMinutes(5).create();
  ScriptApp.newTrigger('dailyDigest').timeBased().everyDays(1).atHour(7).inTimezone(TZ).create();
  ScriptApp.newTrigger('weeklySummary').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(7).inTimezone(TZ).create();
}

/* ---------------------------------------------------------------- webhook */

function doPost(e) {
  var p = props_();
  var key = (e && e.parameter && e.parameter.k) || '';
  if (!p.WEBHOOK_KEY || !safeEqual_(String(key), p.WEBHOOK_KEY)) return text_('forbidden');

  var payload;
  try { payload = JSON.parse(e.postData.contents); } catch (err) { return text_('bad request'); }
  var d = payload && payload.data ? payload.data : {};
  var form = String(payload.form_name || d['form-name'] || '');
  if (form === 'subcontractor' || LEAD_FORMS.indexOf(form) === -1) return text_('ignored');
  var id = String(payload.id || '');
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(id)) return text_('bad request');

  var lead;
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sh = sheet_(SHEETS.leads);
    if (findRow_(sh, id)) return text_('duplicate');
    lead = leadFromPayload_(payload, form, id);
    var c = cols_(sh);
    var row = new Array(LEAD_HEADERS.length);
    for (var h in c) row[c[h] - 1] = '';
    Object.keys(lead.cells).forEach(function (h) { if (c[h]) row[c[h] - 1] = lead.cells[h]; });
    sh.appendRow(row);
    var r = sh.getLastRow();
    sh.getRange(r, c['Log touch']).insertCheckboxes();
  } finally {
    lock.releaseLock();
  }
  sendClaimEmails_(id, lead.firstName, lead.cells['Project type'], lead.cells['Lead type'], lead.cells['Island'], 'New lead');
  return text_('ok');
}

/** Maps Netlify's payload to Leads cells. IP, user agent and referrer are never kept. */
function leadFromPayload_(payload, form, id) {
  var d = payload.data || {};
  var v = function (k) { return d[k] == null ? '' : String(d[k]).trim(); };
  var orOther = function (k, other) { return v(k) === 'Other' && v(other) ? 'Other: ' + v(other) : v(k); };
  var received = payload.created_at ? new Date(payload.created_at) : new Date();
  if (isNaN(received.getTime())) received = new Date();
  var name = v('name') || v('first-name') || String(payload.name || '');
  var leadType = v('lead-type') || (form === 'checklist-request' ? 'checklist' : form);

  var details = [];
  if (form === 'estimate') {
    [['Timeline', 'timeline'], ['Budget', 'budget'], ['Plans', 'plans'], ['ZIP', 'zip'], ['Best time', 'best-time'], ['Notes', 'notes']]
      .forEach(function (x) { if (v(x[1])) details.push(x[0] + ': ' + v(x[1])); });
  } else if (form === 'contact') {
    if (v('message-subject')) details.push('Subject: ' + v('message-subject'));
    if (v('message')) details.push(v('message'));
  } else if (form === 'checklist-request') {
    if (v('checklist')) details.push('Checklist: ' + v('checklist'));
  }

  var cells = {
    'Received (HST)': received,
    'Netlify ID': id,
    'Form': form,
    'Lead type': leadType,
    'Name': name,
    'Phone': v('phone'),
    'Email': v('email') || String(payload.email || ''),
    'Island': orOther('island', 'island-other'),
    'Project type': orOther('project-type', 'project-type-other'),
    'Details': details.join('\n'),
    'Heard about': orOther('heard-about', 'heard-about-other'),
    'Source page': v('source-page'),
    'Text OK': form === 'estimate' ? (v('sms-ok') === 'Yes' ? 'Yes' : 'No') : '',
    'Email OK': form === 'checklist-request' ? (v('email-ok') === 'Yes' ? 'Yes' : 'No') : '',
    'Status': 'New',
    'Touches': 0,
    'Next touch': received, // day 0 of the New cadence
  };
  Object.keys(cells).forEach(function (k) { if (typeof cells[k] === 'string') cells[k] = safeCell_(cells[k]); });
  return { cells: cells, firstName: firstName_(name) };
}

/* ------------------------------------------------------------------ claim */

function doGet(e) {
  var q = (e && e.parameter) || {};
  if (q.a !== 'claim') return page_('ECM lead log', '<p>Nothing here.</p>');
  var who = person_(q.p);
  if (!who || !validSig_(q.id, q.p, q.s)) return page_('Link not valid', '<p>This link is not valid.</p>');
  var sh = sheet_(SHEETS.leads);
  var r = findRow_(sh, String(q.id));
  if (!r) return page_('Lead not found', '<p>This lead is not on the sheet.</p>');
  var c = cols_(sh);
  var row = sh.getRange(r, 1, 1, sh.getLastColumn()).getValues()[0];
  var owner = row[c['Owner'] - 1];
  var first = firstName_(row[c['Name'] - 1]);
  var type = row[c['Project type'] - 1] || row[c['Lead type'] - 1];
  if (owner) return page_('Already claimed', '<p>' + esc_(owner) + ' already claimed it.</p>');
  var args = JSON.stringify([String(q.id), String(q.p), String(q.s)]).replace(/</g, '\\u003c');
  var html =
    '<p><strong>' + esc_(first || 'New lead') + '</strong><br>' + esc_(type || '') + '</p>' +
    '<p><button id="claim" type="button">Claim</button></p><p id="msg" role="status"></p>' +
    '<script>var a=' + args + ';document.getElementById("claim").addEventListener("click",function(){' +
    'var b=this;b.disabled=true;document.getElementById("msg").textContent="Claiming...";' +
    'google.script.run.withSuccessHandler(function(r){document.getElementById("msg").textContent=r.msg;b.hidden=true;})' +
    '.withFailureHandler(function(){b.disabled=false;document.getElementById("msg").textContent="Something went wrong. Try again.";})' +
    '.claimLead(a[0],a[1],a[2]);});</script>';
  return page_('Claim this lead', html);
}

/** Called by the Claim button (google.script.run, a POST). First claim wins. */
function claimLead(id, p, sig) {
  var who = person_(p);
  if (!who || !validSig_(id, p, sig)) return { ok: false, msg: 'This link is not valid.' };
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  var first, type;
  try {
    var sh = sheet_(SHEETS.leads);
    var r = findRow_(sh, String(id));
    if (!r) return { ok: false, msg: 'This lead is not on the sheet.' };
    var c = cols_(sh);
    var row = sh.getRange(r, 1, 1, sh.getLastColumn()).getValues()[0];
    var owner = row[c['Owner'] - 1];
    if (owner) return { ok: false, msg: owner + ' already claimed it.' };
    var now = new Date();
    var received = row[c['Received (HST)'] - 1];
    sh.getRange(r, c['Owner']).setValue(who.name);
    sh.getRange(r, c['Claimed at']).setValue(now);
    if (received instanceof Date) sh.getRange(r, c['Minutes to claim']).setValue(Math.round((now - received) / 60000));
    first = firstName_(row[c['Name'] - 1]);
    type = row[c['Project type'] - 1] || row[c['Lead type'] - 1];
  } finally {
    lock.releaseLock();
  }
  var other = person_(p === '1' ? '2' : '1');
  if (other) {
    MailApp.sendEmail({
      to: other.email,
      subject: who.name + ' claimed it',
      body: who.name + ' claimed the lead from ' + (first || 'a new lead') + (type ? ' (' + type + ')' : '') + '.',
    });
  }
  return { ok: true, msg: 'You claimed it. It is yours now.' };
}

/** Emails both people their Claim link. Returns false when the flood cap held the emails back. */
function sendClaimEmails_(id, first, type, leadType, island, subjectLead) {
  var gate = claimEmailGate_();
  if (!gate.ok) {
    if (gate.alert) mailTeam_(FLOOD_ALERT, FLOOD_ALERT + '.\n\nNew rows are still being added, but claim emails are paused until the count drops.\n\n' + SpreadsheetApp.getActive().getUrl());
    return false;
  }
  var sheetUrl = SpreadsheetApp.getActive().getUrl();
  ['1', '2'].forEach(function (p) {
    var who = person_(p);
    if (!who) return;
    var link = claimUrl_(id, p);
    var summary = [first || 'New lead', leadType, type, island].filter(String).join(', ');
    MailApp.sendEmail({
      to: who.email,
      subject: subjectLead + ': ' + summary,
      body: subjectLead + ': ' + summary + '\n\nClaim it: ' + link + '\n\nLead log: ' + sheetUrl,
      htmlBody: '<p>' + esc_(subjectLead) + ': ' + esc_(summary) + '</p><p><a href="' + esc_(link) + '">Claim it</a></p><p><a href="' + esc_(sheetUrl) + '">Lead log</a></p>',
    });
  });
  return true;
}

/**
 * Flood cap. Counts leads whose claim emails went out in the last hour (one lead = one count,
 * however many people it emails). At the cap: no claim emails; {alert: true} at most once an hour.
 */
function claimEmailGate_() {
  var max = settings_().maxPerHour;
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var dp = PropertiesService.getDocumentProperties();
    var now = Date.now();
    var sent = [];
    try { sent = JSON.parse(dp.getProperty('claimSends') || '[]'); } catch (err) { sent = []; }
    sent = sent.filter(function (t) { return now - t < 3600000; });
    if (sent.length >= max) {
      dp.setProperty('claimSends', JSON.stringify(sent));
      var last = Number(dp.getProperty('floodAlertAt') || 0);
      if (now - last < 3600000) return { ok: false, alert: false };
      dp.setProperty('floodAlertAt', String(now));
      return { ok: false, alert: true };
    }
    sent.push(now);
    dp.setProperty('claimSends', JSON.stringify(sent));
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function claimUrl_(id, p) {
  return webAppUrl_() + '?a=claim&id=' + encodeURIComponent(id) + '&p=' + p + '&s=' + sign_(id, p);
}

function sign_(id, p) {
  var key = props_().CLAIM_SECRET;
  if (!key) throw new Error('CLAIM_SECRET is not set in Script Properties.');
  var bytes = Utilities.computeHmacSha256Signature('claim|' + id + '|' + p, key);
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, '');
}

function validSig_(id, p, sig) {
  if (!id || !sig || !person_(p)) return false;
  try { return safeEqual_(String(sig), sign_(String(id), String(p))); } catch (err) { return false; }
}

/* ------------------------------------------------------- touches, cadence */

/** Simple trigger: Log touch ticked, or Status changed, on the Leads tab. */
function onEdit(e) {
  if (!e || !e.range) return;
  var sh = e.range.getSheet();
  if (sh.getName() !== SHEETS.leads || e.range.getRow() < 2 || e.range.getNumRows() !== 1) return;
  var c = cols_(sh);
  var col = e.range.getColumn();
  if (col === c['Log touch'] && e.value === 'TRUE') logTouch_(sh, e.range.getRow(), c);
  else if (col === c['Status']) startStatus_(sh, e.range.getRow(), c, String(e.value || ''));
}

function logTouch_(sh, r, c) {
  var row = sh.getRange(r, 1, 1, sh.getLastColumn()).getValues()[0];
  var now = new Date();
  var touches = (Number(row[c['Touches'] - 1]) || 0) + 1;
  sh.getRange(r, c['Touches']).setValue(touches);
  sh.getRange(r, c['Last touch']).setValue(now);
  if (!row[c['First contact at'] - 1]) sh.getRange(r, c['First contact at']).setValue(now);
  var id = String(row[c['Netlify ID'] - 1]);
  var status = String(row[c['Status'] - 1] || 'New');
  var cad = cadence_()[status];
  var next = '';
  if (cad) {
    var stage = stage_(id);
    var fromReceived = cad.countsFrom === 'Received';
    var anchor = fromReceived ? row[c['Received (HST)'] - 1] : new Date(stage && stage.status === status ? stage.since : now);
    var k = fromReceived ? touches : ((stage && stage.status === status ? stage.n : 0) + 1);
    if (!fromReceived) saveStage_(id, { status: status, since: anchor.getTime(), n: k });
    var res = nextTouch_(cad, anchor, k);
    if (res.status) {
      sh.getRange(r, c['Status']).setValue(res.status);
      next = startStatus_(sh, r, c, res.status);
    } else {
      next = res.date || '';
    }
  }
  sh.getRange(r, c['Next touch']).setValue(next);
  sh.getRange(r, c['Log touch']).setValue(false);
}

/** A status change starts that status's cadence. Returns the next touch date (or ''). */
function startStatus_(sh, r, c, status) {
  var id = String(sh.getRange(r, c['Netlify ID']).getValue());
  var cad = cadence_()[status];
  var now = new Date();
  saveStage_(id, { status: status, since: now.getTime(), n: 0 });
  var next = '';
  if (cad) {
    var anchor = cad.countsFrom === 'Received' ? sh.getRange(r, c['Received (HST)']).getValue() : now;
    var k = cad.countsFrom === 'Received' ? Number(sh.getRange(r, c['Touches']).getValue()) || 0 : 0;
    var res = nextTouch_(cad, anchor, k);
    next = res.date || '';
  }
  sh.getRange(r, c['Next touch']).setValue(next);
  return next;
}

/** k = touches already done in this sequence. Returns {date} or {status} (move on). */
function nextTouch_(cad, anchor, k) {
  if (!(anchor instanceof Date) || !cad.offsets.length) return {};
  if (k < cad.offsets.length) return { date: addOffset_(anchor, cad.offsets[k]) };
  var j = k - cad.offsets.length + 1;
  if (cad.every > 0 && (cad.repeat === 0 || j <= cad.repeat)) {
    var lastDays = parseInt(cad.offsets[cad.offsets.length - 1], 10) || 0;
    return { date: addOffset_(anchor, String(lastDays + j * cad.every)) };
  }
  return cad.after ? { status: cad.after } : {};
}

function cadence_() {
  var sh = sheet_(SHEETS.cadence);
  var values = sh.getDataRange().getValues();
  var out = {};
  for (var i = 1; i < values.length; i++) {
    var v = values[i];
    if (!v[0]) continue;
    out[String(v[0])] = {
      offsets: String(v[1] || '').split(',').map(function (x) { return x.trim(); }).filter(String),
      every: Number(v[2]) || 0,
      repeat: Number(v[3]) || 0,
      after: String(v[4] || ''),
      countsFrom: String(v[5] || 'Status change'),
    };
  }
  return out;
}

/** "3" = 3 calendar days, "1b" = 1 business day (Mon to Fri). Keeps the time of day. */
function addOffset_(date, offset) {
  var n = parseInt(offset, 10) || 0;
  var d = new Date(date.getTime());
  if (/b$/i.test(String(offset))) {
    while (n > 0) {
      d.setDate(d.getDate() + 1);
      var day = Number(Utilities.formatDate(d, TZ, 'u')); // 1 Monday .. 7 Sunday
      if (day <= 5) n--;
    }
    return d;
  }
  d.setDate(d.getDate() + n);
  return d;
}

function stage_(id) {
  var raw = PropertiesService.getDocumentProperties().getProperty('stage_' + id);
  try { return raw ? JSON.parse(raw) : null; } catch (err) { return null; }
}
function saveStage_(id, stage) {
  PropertiesService.getDocumentProperties().setProperty('stage_' + id, JSON.stringify(stage));
}

/* --------------------------------------------------------------- triggers */

/** Every 5 minutes: on response days, 7:00 to 19:00 HST, leads still New and unclaimed after 15 minutes get one nudge. */
function nudgeUnclaimed() {
  var settings = settings_();
  var now = new Date();
  if (settings.days.indexOf(dayOfWeek_(now)) === -1) return;
  var hour = Number(Utilities.formatDate(now, TZ, 'H'));
  if (hour < settings.start || hour >= settings.end) return;
  var sh = sheet_(SHEETS.leads);
  var c = cols_(sh);
  var values = sh.getDataRange().getValues();
  var docProps = PropertiesService.getDocumentProperties();
  var cutoff = Date.now() - settings.after * 60000;
  for (var i = 1; i < values.length; i++) {
    var v = values[i];
    var id = String(v[c['Netlify ID'] - 1]);
    var received = v[c['Received (HST)'] - 1];
    if (!id || v[c['Status'] - 1] !== 'New' || v[c['Owner'] - 1] || !(received instanceof Date) || received.getTime() > cutoff) continue;
    if (docProps.getProperty('nudged_' + id)) continue;
    // Marked only when the emails went out (the flood cap can hold them back; the next run retries).
    if (sendClaimEmails_(id, firstName_(v[c['Name'] - 1]), v[c['Project type'] - 1], v[c['Lead type'] - 1], v[c['Island'] - 1], 'Still unclaimed')) {
      docProps.setProperty('nudged_' + id, '1');
    }
  }
}

/**
 * 07:00 on response days: leads since the last response day's window closed (19:00), touches
 * due today by owner, overdue leads. With Mon to Sat, Monday covers Saturday 19:00 to Monday 07:00.
 */
function dailyDigest() {
  var settings = settings_();
  var now = new Date();
  if (settings.days.indexOf(dayOfWeek_(now)) === -1) return;
  var sh = sheet_(SHEETS.leads);
  var c = cols_(sh);
  var values = sh.getDataRange().getValues();
  var today = Utilities.formatDate(now, TZ, 'yyyy-MM-dd');
  var overnightTo = hstDate_(today, settings.start);
  var overnightFrom = hstDate_(previousResponseDay_(today, settings.days), settings.end);
  var overnight = [], due = {}, overdue = [];
  for (var i = 1; i < values.length; i++) {
    var v = values[i];
    if (!v[c['Netlify ID'] - 1]) continue;
    var line = leadLine_(v, c);
    var received = v[c['Received (HST)'] - 1];
    if (received instanceof Date && received >= overnightFrom && received < overnightTo) overnight.push(line);
    var status = v[c['Status'] - 1];
    var next = v[c['Next touch'] - 1];
    if (ACTIVE.indexOf(status) === -1 || !(next instanceof Date)) continue;
    var nextDay = Utilities.formatDate(next, TZ, 'yyyy-MM-dd');
    if (nextDay < today) overdue.push(line + ' (due ' + nextDay + ')');
    else if (nextDay === today) {
      var owner = v[c['Owner'] - 1] || 'Unclaimed';
      (due[owner] = due[owner] || []).push(line);
    }
  }
  var body = ['Lead log, ' + today, ''];
  body.push('Leads since ' + Utilities.formatDate(overnightFrom, TZ, 'EEE h:mm a') + ' (' + overnight.length + ')');
  body = body.concat(overnight.length ? overnight.map(bullet_) : ['  none']);
  body.push('', 'Touches due today');
  var owners = Object.keys(due);
  if (!owners.length) body.push('  none');
  owners.forEach(function (o) { body.push('  ' + o + ' (' + due[o].length + ')'); body = body.concat(due[o].map(function (l) { return '    ' + l; })); });
  body.push('', 'Overdue (' + overdue.length + ')');
  body = body.concat(overdue.length ? overdue.map(bullet_) : ['  none']);
  body.push('', SpreadsheetApp.getActive().getUrl());
  mailTeam_('Lead log, ' + today + ': ' + overnight.length + ' overnight, ' + overdue.length + ' overdue', body.join('\n'));
}

/** Monday 07:00: last 7 and 30 days. */
function weeklySummary() {
  var sh = sheet_(SHEETS.leads);
  var c = cols_(sh);
  var values = sh.getDataRange().getValues().slice(1).filter(function (v) { return v[c['Netlify ID'] - 1]; });
  var body = ['Weekly lead summary, ' + Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'), ''];
  [7, 30].forEach(function (days) {
    var from = Date.now() - days * 86400000;
    var rows = values.filter(function (v) { var r = v[c['Received (HST)'] - 1]; return r instanceof Date && r.getTime() >= from; });
    var col = function (h) { return rows.map(function (v) { return v[c[h] - 1]; }); };
    var statusIn = function (list) { return col('Status').filter(function (s) { return list.indexOf(s) !== -1; }).length; };
    var contacted = rows.filter(function (v) { return v[c['First contact at'] - 1] instanceof Date; });
    var toFirst = contacted.map(function (v) { return Math.round((v[c['First contact at'] - 1] - v[c['Received (HST)'] - 1]) / 60000); });
    body.push('Last ' + days + ' days: ' + rows.length + ' leads');
    body.push('  By lead type: ' + tally_(col('Lead type')));
    body.push('  By heard about: ' + tally_(col('Heard about')));
    body.push('  By source page: ' + tally_(col('Source page')));
    body.push('  Median minutes to claim: ' + median_(col('Minutes to claim').filter(isNum_)));
    body.push('  Median minutes to first contact: ' + median_(toFirst));
    body.push('  Contact rate: ' + (rows.length ? Math.round((contacted.length / rows.length) * 100) + '%' : 'n/a'));
    body.push('  Site visits (status Site visit booked, Proposal sent or Won): ' + statusIn(['Site visit booked', 'Proposal sent', 'Won']));
    body.push('  Proposals (status Proposal sent or Won): ' + statusIn(['Proposal sent', 'Won']));
    body.push('  Won: ' + statusIn(['Won']));
    var lost = rows.filter(function (v) { return v[c['Status'] - 1] === 'Lost'; }).map(function (v) { return v[c['Outcome reason'] - 1] || 'no reason given'; });
    body.push('  Lost by reason: ' + (lost.length ? tally_(lost) : 'none'));
    body.push('  Step counts: ' + funnelSummary_(days));
    body.push('');
  });
  body.push('Counts use each lead\'s current status. ' + SpreadsheetApp.getActive().getUrl());
  mailTeam_('Weekly lead summary', body.join('\n'));
}

/** Step counts from the site's /api/f/report (production only). */
function funnelSummary_(days) {
  var p = props_();
  if (!p.SITE_URL || !p.FUNNEL_REPORT_TOKEN) return 'not set up (SITE_URL or FUNNEL_REPORT_TOKEN missing)';
  var res = UrlFetchApp.fetch(p.SITE_URL.replace(/\/$/, '') + '/api/f/report?days=' + days, {
    headers: { Authorization: 'Bearer ' + p.FUNNEL_REPORT_TOKEN },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) return 'unavailable (HTTP ' + res.getResponseCode() + ')';
  var totals = {};
  JSON.parse(res.getContentText()).rows.forEach(function (r) {
    var k = r.f + ' ' + r.e + (r.f === 'estimate' && r.e === 'view' ? ' step ' + r.s : '');
    totals[k] = (totals[k] || 0) + r.count;
  });
  var keys = Object.keys(totals).sort();
  return keys.length ? keys.map(function (k) { return k + ': ' + totals[k]; }).join(', ') : 'none';
}

/* ---------------------------------------------------------------- helpers */

function props_() { return PropertiesService.getScriptProperties().getProperties(); }

function person_(p) {
  var all = props_();
  if (p !== '1' && p !== '2') return null;
  var name = all['TEAM_' + p + '_NAME'], email = all['TEAM_' + p + '_EMAIL'];
  return name && email ? { name: name, email: email } : null;
}

function webAppUrl_() { return props_().WEB_APP_URL || ScriptApp.getService().getUrl(); }

function sheet_(name) {
  var sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh) throw new Error('Missing tab "' + name + '". Run setupSheet first.');
  return sh;
}

/** Header name -> 1-based column number. */
function cols_(sh) {
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var out = {};
  head.forEach(function (h, i) { if (h) out[String(h)] = i + 1; });
  return out;
}

function findRow_(sh, id) {
  var c = cols_(sh);
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var hit = sh.getRange(2, c['Netlify ID'], last - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}

function settings_() {
  var values = sheet_(SHEETS.settings).getDataRange().getValues();
  var raw = function (label) {
    for (var i = 1; i < values.length; i++) if (values[i][0] === label) return values[i][1];
    return '';
  };
  var num = function (label, dflt) { return Number(raw(label)) || dflt; };
  return {
    after: num('Nudge after (minutes)', 15),
    start: num('Nudge window start (hour, HST)', 7),
    end: num('Nudge window end (hour, HST)', 19),
    days: parseDays_(raw('Response days')),
    maxPerHour: num('Max claim emails per hour', 10),
  };
}

/** "Mon to Sat", "Mon, Wed, Fri" or "Mon to Fri, Sun" -> [1..7] (1 Monday). Blank or unreadable: Mon to Sat. */
function parseDays_(text) {
  var dayNum = function (word) { return DAY_NAMES.indexOf(String(word).trim().slice(0, 3).toLowerCase()) + 1; };
  var picked = {};
  String(text || '').split(/\s*,\s*|\s+and\s+/i).forEach(function (part) {
    var range = part.match(/^\s*([a-z]+)\s+to\s+([a-z]+)\s*$/i);
    if (range) {
      var a = dayNum(range[1]), b = dayNum(range[2]);
      if (!a || !b) return;
      for (var d = a; ; d = (d % 7) + 1) { picked[d] = true; if (d === b) break; }
    } else if (dayNum(part)) {
      picked[dayNum(part)] = true;
    }
  });
  var days = Object.keys(picked).map(Number).sort();
  return days.length ? days : [1, 2, 3, 4, 5, 6];
}

/** 1 Monday .. 7 Sunday, Hawaii time. */
function dayOfWeek_(date) { return Number(Utilities.formatDate(date, TZ, 'u')); }

/** The last response day before `day` (yyyy-MM-dd, Hawaii), as yyyy-MM-dd. */
function previousResponseDay_(day, days) {
  var noon = hstDate_(day, 12).getTime();
  for (var k = 1; k <= 7; k++) {
    var d = new Date(noon - k * 86400000);
    if (days.indexOf(dayOfWeek_(d)) !== -1) return Utilities.formatDate(d, TZ, 'yyyy-MM-dd');
  }
  return Utilities.formatDate(new Date(noon - 86400000), TZ, 'yyyy-MM-dd');
}

/** Midnight HST of a yyyy-MM-dd day plus `hours`. HST is UTC-10 all year. */
function hstDate_(day, hours) {
  var parts = day.split('-').map(Number);
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 10 + hours, 0, 0));
}

function leadLine_(v, c) {
  var when = v[c['Received (HST)'] - 1];
  return [firstName_(v[c['Name'] - 1]) || 'Lead', v[c['Lead type'] - 1], v[c['Project type'] - 1], v[c['Island'] - 1],
    when instanceof Date ? Utilities.formatDate(when, TZ, 'MMM d h:mm a') : ''].filter(String).join(', ');
}

function mailTeam_(subject, body) {
  ['1', '2'].forEach(function (p) { var who = person_(p); if (who) MailApp.sendEmail({ to: who.email, subject: subject, body: body }); });
}

function tally_(list) {
  var t = {};
  list.forEach(function (x) { var k = String(x || '(blank)'); t[k] = (t[k] || 0) + 1; });
  return Object.keys(t).sort(function (a, b) { return t[b] - t[a]; }).map(function (k) { return k + ' ' + t[k]; }).join(', ') || 'none';
}

function median_(nums) {
  if (!nums.length) return 'n/a';
  var s = nums.slice().sort(function (a, b) { return a - b; });
  var m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

function isNum_(x) { return typeof x === 'number' && !isNaN(x); }
function bullet_(l) { return '  ' + l; }
function firstName_(name) { return String(name || '').trim().split(/\s+/)[0] || ''; }

/** Text from a form never starts a formula in the sheet. */
function safeCell_(s) {
  s = String(s).slice(0, 5000);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function esc_(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function safeEqual_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function text_(s) { return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.TEXT); }

function page_(title, html) {
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<style>body{font:18px/1.5 system-ui,sans-serif;margin:32px 16px;max-width:520px}button{font:inherit;padding:12px 28px;border-radius:8px;border:0;background:#2d5f9a;color:#fff;cursor:pointer}</style>' +
    '<h1 style="font-size:1.4rem">' + esc_(title) + '</h1>' + html
  ).setTitle(title);
}
