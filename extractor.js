/**
 * Advanced scam detection with 2025 patterns and behavioral intelligence
 * Returns exactly 6 fields: emails, upiIds, phoneNumbers, phishingLinks, bankAccounts, suspiciousKeywords
 */

// ═══════════════════════════════════════════════════════════════════════════
// 1. ENHANCED REGEX PATTERNS (Based on 2025 Standards)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Indian Phone Numbers (10 digits, starts with 6-9)
 * Handles: 9876543210, +919876543210, +91 9876543210, 09876543210
 */
const PHONE_REGEX = /(?:(?:\+91[\s-]?)|0)?[6-9]\d{9}\b/g;

/**
 * Bank Account Numbers (9-18 digits)
 * Indian banks: typically 9-18 digits
 */
const BANK_ACCOUNT_REGEX = /\b\d{9,18}\b/g;

/**
 * UPI ID Pattern (2025 Standard)
 * Format: username@bankhandle
 */
const UPI_REGEX = /\b[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}\b/gi;

/**
 * Email Pattern
 */
const EMAIL_REGEX = /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/g;

/**
 * URL Pattern
 */
const URL_REGEX = /(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[a-z]{2,})+(?:\/[^\s]*)?/gi;

// ═══════════════════════════════════════════════════════════════════════════
// 2. COMPREHENSIVE THREAT INTELLIGENCE (2025 Patterns)
// ═══════════════════════════════════════════════════════════════════════════

const SUSPICIOUS_KEYWORDS = [
  // URGENCY & TIME PRESSURE
  "urgent", "immediately", "within 24 hours", "within 48 hours",
  "action required", "respond now", "act now", "time sensitive",
  "last warning", "final notice", "expire", "expires today",
  "limited time", "hurry", "quick", "fast", "asap",

  // VERIFICATION & ACCOUNT THREATS
  "verify now", "verify your account", "verification required",
  "confirm your identity", "re-verify", "update required",
  "account suspended", "account blocked", "account locked",
  "account deactivated", "account terminated", "unauthorized activity",
  "unusual activity", "suspicious activity", "security alert",
  "kyc expired", "kyc pending", "kyc verification",

  // FINANCIAL THREATS
  "payment pending", "payment failed", "transaction failed",
  "pay now", "pay immediately", "transfer now", "transfer funds",
  "refund pending", "refund available", "tax refund",
  "prize money", "lottery", "winner", "congratulations",
  "cashback", "bonus", "reward", "claim now",
  "registration fee", "processing fee", "activation fee",
  "penalty", "fine", "overdue", "outstanding balance",

  // BANKING & UPI SPECIFIC
  "unlinked", "link expired", "manual sync", "re-link",
  "upi blocked", "upi deactivated", "pension credit",
  "mandate", "rbi mandate", "regulatory block", "compliance",
  "aadhar", "aadhaar", "pan card", "kyc documents",

  // AUTHORITY IMPERSONATION
  "official", "government", "income tax", "irs", "tax authority",
  "police", "cyber crime", "legal action", "court notice",
  "arrest warrant", "case filed", "fir", "investigation",
  "rbi", "reserve bank", "sebi", "uidai",

  // TECH SUPPORT SCAMS
  "anydesk", "teamviewer", "remote access", "screen share",
  "download app", "install app", "apk file", "update app",
  "tech support", "customer care", "helpline",
  "quick support", "instant help",

  // CREDENTIAL THEFT
  "otp", "one time password", "verification code",
  "share otp", "send otp", "enter otp", "confirm otp",
  "password", "pin", "cvv", "card details",
  "banking details", "account details", "personal information",

  // MODERN THREATS (2025)
  "ai verification", "biometric update", "face verification",
  "whatsapp verification", "telegram verification",
  "nft", "crypto", "bitcoin", "investment opportunity",
  "trading bot", "forex", "stock tips",
  "zoom meeting", "google meet", "online interview",
  "work from home", "job offer", "recruitment",
  "package delivery", "courier", "redelivery fee",
  "customs clearance", "import duty",
  "click here", "tap here", "swipe up", "link in bio",
  "exclusive offer", "limited seats", "vip access",
  "free gift", "free trial", "risk free",

  // BRAND IMPERSONATION
  "amazon", "flipkart", "paytm", "phonepe", "google pay",
  "gpay", "netflix", "prime video", "hotstar",
  "tata", "reliance", "airtel", "jio", "vodafone",
  "sbi", "hdfc", "icici", "axis", "kotak",
  "income tax department", "gst portal", "epfo",

  // SOCIAL ENGINEERING
  "help needed", "family emergency", "medical emergency",
  "accident", "hospital", "medicine",
  "you won", "selected", "eligible",
  "claim your", "redeem now", "activate now",
  "don't ignore", "important", "confidential"
];

const URL_SHORTENERS = [
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly",
  "buff.ly", "rebrand.ly", "cutt.ly", "is.gd", "short.io",
  "tiny.cc", "cli.gs", "pic.gd", "migre.me", "ff.im",
  "tiny.pl", "url4.eu", "tr.im", "twit.ac", "su.pr",
  "twurl.nl", "snipurl.com", "short.to", "ping.fm",
  "post.ly", "bkite.com", "snipr.com", "fic.kr",
  "loopt.us", "doiop.com", "twitthis.com", "htxt.it",
  "short.ie", "kl.am", "wp.me", "rubyurl.com",
  "to.ly", "bit.do", "lnkd.in", "db.tt", "qr.ae",
  "adf.ly", "cur.lv", "ity.im", "q.gs", "v.gd"
];

const SUSPICIOUS_TLDS = [
  ".tk", ".ml", ".ga", ".cf", ".gq",
  ".click", ".link", ".download", ".loan", ".racing",
  ".stream", ".trade", ".webcam", ".win", ".zip",
  ".top", ".buzz", ".club", ".work", ".online"
];

const LEGITIMATE_BANKING_DOMAINS = [
  "sbi.co.in", "onlinesbi.com", "hdfcbank.com", "icicibank.com",
  "axisbank.com", "kotakbank.com", "yesbank.in", "pnbindia.in",
  "bankofbaroda.in", "canarabank.com", "unionbankofindia.co.in",
  "indianbank.in", "bankofindia.co.in", "boi.co.in",
  "paytm.com", "phonepe.com", "googlepay.com", "amazon.in"
];

// ═══════════════════════════════════════════════════════════════════════════
// 3. MAIN EXTRACTION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

function extractIntelligence(text) {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return {
      emails: [],
      upiIds: [],
      phoneNumbers: [],
      phishingLinks: [],
      bankAccounts: [],
      suspiciousKeywords: []
    };
  }

  const normalizedText = text.trim();
  const lowerText = normalizedText.toLowerCase();

  // Extract emails (excluding UPI IDs)
  const emailMatches = Array.from(normalizedText.matchAll(EMAIL_REGEX))
    .map(match => match[0].toLowerCase())
    .filter(email => !isUpiId(email));

  // Extract UPI IDs
  const upiMatches = Array.from(normalizedText.matchAll(UPI_REGEX))
    .map(match => match[0].toLowerCase())
    .filter(upi => isValidUpiId(upi));

  // Extract URLs (excluding emails)
  const urlMatches = Array.from(normalizedText.matchAll(URL_REGEX))
    .map(match => match[0])
    .filter(url => !url.includes("@"))
    .filter(url => !isLegitimateUrl(url));

  // Extract phone numbers
  const phoneMatches = Array.from(normalizedText.matchAll(PHONE_REGEX))
    .map(match => normalizePhoneNumber(match[0]));

  // Extract bank account numbers
  const bankAccountMatches = Array.from(normalizedText.matchAll(BANK_ACCOUNT_REGEX))
    .map(match => match[0]);

  // Conflict resolution
  const phoneSet = new Set(phoneMatches);
  const bankAccounts = [...new Set(bankAccountMatches.filter(num => {
    const normalized = normalizePhoneNumber(num);
    return !phoneSet.has(normalized) && num.length >= 9;
  }))];

  // Detect suspicious keywords
  const detectedKeywords = SUSPICIOUS_KEYWORDS.filter(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );

  // Check for URL shorteners
  if (urlMatches.some(url => URL_SHORTENERS.some(s => url.toLowerCase().includes(s)))) {
    detectedKeywords.push("url_shortener_detected");
  }

  // Check for suspicious TLDs
  if (urlMatches.some(url => SUSPICIOUS_TLDS.some(tld => url.toLowerCase().endsWith(tld)))) {
    detectedKeywords.push("suspicious_tld_detected");
  }

  // Check for suspicious URL patterns
  if (urlMatches.some(url => {
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes("secure") || lowerUrl.includes("verify") ||
      lowerUrl.includes("login") || lowerUrl.includes("account");
  })) {
    detectedKeywords.push("suspicious_url_pattern");
  }

  // Check for multiple phone numbers
  if (phoneSet.size > 2) {
    detectedKeywords.push("multiple_phone_numbers");
  }

  // Check for credential requests
  if (lowerText.match(/(?:share|send|enter|provide|give).*(?:otp|password|pin|cvv)/i)) {
    detectedKeywords.push("credential_request_detected");
  }

  return {
    emails: [...new Set(emailMatches)],
    upiIds: [...new Set(upiMatches)],
    phoneNumbers: [...phoneSet],
    phishingLinks: [...new Set(urlMatches)],
    bankAccounts: bankAccounts,
    suspiciousKeywords: [...new Set(detectedKeywords)]
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function isUpiId(email) {
  const commonUpiHandles = [
    "paytm", "ybl", "okaxis", "okicici", "oksbi", "okhdfcbank",
    "axl", "ibl", "upi", "yapl", "ikwik", "pz", "apl",
    "axisbank", "hdfcbank", "sbi", "icici", "kotak"
  ];
  const handle = email.split("@")[1]?.toLowerCase() || "";
  return commonUpiHandles.some(h => handle.includes(h) || handle.startsWith("ok"));
}

function isValidUpiId(upi) {
  if (!upi.includes("@")) return false;
  const [username, handle] = upi.split("@");
  if (!username || username.length < 2 || username.length > 256) return false;
  if (!handle || handle.length < 2 || handle.length > 64) return false;
  return /[a-zA-Z]{2,}/.test(handle);
}

function normalizePhoneNumber(phone) {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    cleaned = cleaned.substring(2);
  }
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

function isLegitimateUrl(url) {
  const lowerUrl = url.toLowerCase();
  return LEGITIMATE_BANKING_DOMAINS.some(domain => lowerUrl.includes(domain));
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. MERGE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

function mergeIntelligence(existing, newData) {
  return {
    emails: [...new Set([...(existing.emails || []), ...(newData.emails || [])])],
    upiIds: [...new Set([...(existing.upiIds || []), ...(newData.upiIds || [])])],
    phoneNumbers: [...new Set([...(existing.phoneNumbers || []), ...(newData.phoneNumbers || [])])],
    phishingLinks: [...new Set([...(existing.phishingLinks || []), ...(newData.phishingLinks || [])])],
    bankAccounts: [...new Set([...(existing.bankAccounts || []), ...(newData.bankAccounts || [])])],
    suspiciousKeywords: [...new Set([...(existing.suspiciousKeywords || []), ...(newData.suspiciousKeywords || [])])]
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. RISK SCORING (BONUS FEATURE)
// ═══════════════════════════════════════════════════════════════════════════

function calculateRiskScore(intelligence) {
  let score = 0;
  const factors = [];

  if (intelligence.phoneNumbers.length > 2) {
    score += 30;
    factors.push("Multiple phone numbers");
  }

  if (intelligence.phishingLinks.length > 0) {
    score += 40;
    factors.push("Contains suspicious URLs");
  }

  if (intelligence.upiIds.length > 0) {
    score += 20;
    factors.push("Payment request detected");
  }

  const keywordCount = intelligence.suspiciousKeywords.length;
  if (keywordCount > 10) {
    score += 50;
    factors.push("High phishing keyword density");
  } else if (keywordCount > 5) {
    score += 30;
    factors.push("Moderate phishing keywords");
  } else if (keywordCount > 0) {
    score += 15;
    factors.push("Some phishing indicators");
  }

  if (intelligence.suspiciousKeywords.includes("credential_request_detected")) {
    score += 40;
    factors.push("Requests credentials/OTP");
  }

  if (intelligence.suspiciousKeywords.includes("url_shortener_detected")) {
    score += 25;
    factors.push("Uses URL shortener");
  }

  if (intelligence.suspiciousKeywords.includes("suspicious_tld_detected")) {
    score += 35;
    factors.push("Suspicious domain extension");
  }

  score = Math.min(score, 100);

  return {
    score: score,
    level: score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW",
    factors: factors
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

module.exports = {
  extractIntelligence,
  mergeIntelligence,
  calculateRiskScore
};
