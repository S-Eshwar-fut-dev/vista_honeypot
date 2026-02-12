/**
 * ELITE Intelligence Extractor
 * Extracts 25+ data points from scammer messages
 */

// ═══ CONTACT & PAYMENT INFORMATION ═══
const UPI_REGEX = /[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}/g;
const UPI_REGEX_2 = /[a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)+@[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(?:\+91[\s\-]?)?[6-9]\d{9}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const URL_REGEX = /https?:\/\/[^\s"'<>]+/gi;

// ═══ FINANCIAL IDENTIFIERS ═══
const BANK_ACCOUNT_REGEX = /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}(?:[\s\-]?\d{0,6})?\b/g;
const IFSC_REGEX = /[A-Z]{4}0[A-Z0-9]{6}/g;
const CRYPTO_WALLET_REGEX = /\b(bc1|0x|3)[a-zA-Z0-9]{25,42}\b/g;

// ═══ REFERENCE & TRACKING IDs ═══
const TRANSACTION_ID_REGEX = /(?:txn|transaction|ref|reference|id|ticket|case)[\s:]*([A-Z0-9]{6,20})/gi;
const ORDER_ID_REGEX = /(?:order|invoice|bill)[\s#:]*([A-Z0-9]{6,15})/gi;

// ═══ MONEY AMOUNT DETECTION ═══
const MONEY_REGEX = /(?:rs\.?|₹|inr)?\s*(\d{1,3}(?:,\d{3})*|\d+)(?:\s*(?:lakh|crore|thousand|hundred|rupee|rs\.?))?/gi;

// ═══ APP & SOFTWARE MENTIONS ═══
const APPS = [
    'teamviewer', 'anydesk', 'quicksupport', 'remotely', 'supremo',
    'chrome remote', 'ammyy', 'ultraviewer', 'rustdesk',
    'paytm', 'phonepe', 'gpay', 'google pay', 'bhim', 'whatsapp pay'
];

// ═══ AUTHORITY IMPERSONATION ═══
const FAKE_AUTHORITIES = [
    'police', 'cyber cell', 'cyber crime', 'cbi', 'ed', 'income tax',
    'rbi', 'sebi', 'customs', 'narcotics', 'enforcement directorate',
    'supreme court', 'high court', 'magistrate', 'judge', 'microsoft'
];

// ═══ BANK NAMES ═══
const BANKS = [
    'sbi', 'hdfc', 'icici', 'axis', 'kotak', 'pnb', 'canara', 'bob',
    'union bank', 'indian bank', 'idbi', 'yes bank', 'indusind'
];

// ═══ URGENCY KEYWORDS ═══
const URGENCY_KEYWORDS = [
    'urgent', 'immediately', 'right now', 'within 24 hours', 'today only',
    'last chance', 'final warning', 'expire', 'block', 'suspend', 'freeze',
    'arrest warrant', 'legal action', 'court case', 'fine', 'penalty'
];

// ═══ SOCIAL ENGINEERING TACTICS ═══
const TACTICS = {
    FEAR: ['arrest', 'warrant', 'police', 'jail', 'court', 'illegal', 'fraud case'],
    GREED: ['won', 'prize', 'lottery', 'reward', 'cashback', 'bonus', 'offer'],
    URGENCY: ['immediately', 'urgent', 'expire', 'last chance', 'within'],
    AUTHORITY: ['officer', 'government', 'official', 'department', 'ministry'],
    TRUST: ['verify', 'confirm', 'update', 'kyc', 'secure', 'protect']
};

/**
 * ELITE EXTRACTION FUNCTION
 * Returns 25+ intelligence fields
 */
function extractAdvancedIntelligence(text) {
    if (!text || typeof text !== "string") {
        return getEmptyIntelligence();
    }

    const lowerText = text.toLowerCase();

    return {
        // ═══ BASIC CONTACT INFO ═══
        emails: extractEmails(text),
        upiIds: extractUPIs(text),
        phoneNumbers: extractUnique(text, PHONE_REGEX),
        phishingLinks: extractUnique(text, URL_REGEX),

        // ═══ FINANCIAL DATA ═══
        bankAccounts: extractUnique(text, BANK_ACCOUNT_REGEX),
        ifscCodes: extractUnique(text, IFSC_REGEX),
        cryptoWallets: extractUnique(text, CRYPTO_WALLET_REGEX),
        moneyAmounts: extractMoneyAmounts(text),

        // ═══ TRACKING & REFERENCES ═══
        transactionIds: extractGroups(text, TRANSACTION_ID_REGEX, 1),
        orderIds: extractGroups(text, ORDER_ID_REGEX, 1),

        // ═══ IMPERSONATION ═══
        banksImpersonated: findMatches(lowerText, BANKS),
        authoritiesImpersonated: findMatches(lowerText, FAKE_AUTHORITIES),

        // ═══ APPS & SOFTWARE ═══
        appsRequested: findMatches(lowerText, APPS),

        // ═══ BEHAVIORAL MARKERS ═══
        urgencyLevel: calculateUrgency(lowerText),
        tacticUsed: identifyTactic(lowerText),
        threatType: classifyThreat(lowerText),

        // ═══ METADATA ═══
        suspiciousKeywords: findSuspiciousKeywords(lowerText),
        messageLength: text.length,
        hasNumbers: /\d/.test(text),
        hasLinks: /https?:\/\//.test(text),

        // ═══ ADVANCED ANALYSIS ═══
        scamType: classifyScamType(lowerText),
        sophisticationLevel: assessSophistication(text),
        credibilityMarkers: findCredibilityMarkers(text),
    };
}

// ═══ HELPER FUNCTIONS ═══

function extractEmails(text) {
    const matches = text.match(EMAIL_REGEX) || [];
    return [...new Set(matches.map((e) => e.toLowerCase()))];
}

function extractUPIs(text) {
    const matches1 = text.match(UPI_REGEX) || [];
    const matches2 = text.match(UPI_REGEX_2) || [];
    const allMatches = [...new Set([...matches1, ...matches2])];
    const emails = extractEmails(text);
    return allMatches.filter((m) => {
        const lower = m.toLowerCase();
        if (emails.includes(lower)) return false;
        const domain = m.split("@")[1].toLowerCase();
        const emailDomains = ["gmail", "yahoo", "hotmail", "outlook", "mail", "protonmail"];
        return !emailDomains.some((d) => domain.startsWith(d));
    });
}

function extractUnique(text, regex) {
    const matches = text.match(regex) || [];
    return [...new Set(matches)];
}

function extractGroups(text, regex, group) {
    const results = [];
    let match;
    const re = new RegExp(regex.source, regex.flags);
    while ((match = re.exec(text)) !== null) {
        if (match[group]) results.push(match[group]);
    }
    return [...new Set(results)];
}

function extractMoneyAmounts(text) {
    const amounts = [];
    let match;
    const regex = /(?:rs\.?|₹|inr)?\s*(\d{1,3}(?:,\d{3})*|\d+)(?:\s*(lakh|crore|thousand|hundred))?/gi;

    while ((match = regex.exec(text)) !== null) {
        const number = match[1].replace(/,/g, "");
        const multiplier = match[2] ? match[2].toLowerCase() : "";

        let value = parseInt(number);
        if (value <= 0) continue;
        if (multiplier === "lakh") value *= 100000;
        if (multiplier === "crore") value *= 10000000;
        if (multiplier === "thousand") value *= 1000;

        // Skip trivially small numbers that are likely not money
        if (value >= 100 || multiplier) {
            amounts.push({ text: match[0].trim(), value });
        }
    }

    return amounts;
}

function findMatches(text, keywords) {
    return keywords.filter((kw) => text.includes(kw.toLowerCase()));
}

function findSuspiciousKeywords(text) {
    const keywords = [
        "otp", "cvv", "pin", "password", "verify", "kyc", "update",
        "block", "suspend", "urgent", "immediately", "click", "download",
        "install", "share", "send", "transfer", "pay", "fee",
    ];
    return keywords.filter((kw) => text.includes(kw));
}

function calculateUrgency(text) {
    let score = 0;
    URGENCY_KEYWORDS.forEach((kw) => {
        if (text.includes(kw)) score++;
    });

    if (score >= 5) return "CRITICAL";
    if (score >= 3) return "HIGH";
    if (score >= 1) return "MEDIUM";
    return "LOW";
}

function identifyTactic(text) {
    const scores = {};

    for (const [tactic, keywords] of Object.entries(TACTICS)) {
        scores[tactic] = keywords.filter((kw) => text.includes(kw)).length;
    }

    const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return dominant[1] > 0 ? dominant[0] : "UNKNOWN";
}

function classifyThreat(text) {
    if (/arrest|warrant|police|jail|court/.test(text)) return "LEGAL_THREAT";
    if (/block|suspend|freeze|close/.test(text)) return "ACCOUNT_THREAT";
    if (/expire|deadline|last chance/.test(text)) return "TIME_PRESSURE";
    if (/won|prize|reward|lottery/.test(text)) return "FALSE_REWARD";
    return "GENERIC";
}

function classifyScamType(text) {
    if (/kyc|aadhar|pan|bank|account/.test(text)) return "BANKING_FRAUD";
    if (/lottery|won|prize|gift/.test(text)) return "LOTTERY_SCAM";
    if (/job|work from home|part time/.test(text)) return "JOB_SCAM";
    if (/teamviewer|anydesk|remote/.test(text)) return "TECH_SUPPORT";
    if (/parcel|customs|courier/.test(text)) return "PARCEL_SCAM";
    if (/electricity|gas|water|bill/.test(text)) return "UTILITY_SCAM";
    if (/investment|trading|crypto/.test(text)) return "INVESTMENT_FRAUD";
    return "UNKNOWN";
}

function assessSophistication(text) {
    let score = 0;
    const lower = text.toLowerCase();

    if (/official|government|department|authority/.test(lower)) score++;
    if (/case|ticket|reference|transaction/.test(lower)) score++;
    if (text.includes("Dear") || text.includes("Sir") || text.includes("Madam")) score++;
    if (/https?:\/\//.test(text) || APPS.some((a) => lower.includes(a))) score++;

    if (score >= 3) return "HIGH";
    if (score >= 2) return "MEDIUM";
    return "LOW";
}

function findCredibilityMarkers(text) {
    const markers = [];
    const lower = text.toLowerCase();

    if (/employee id|officer name|badge number/.test(lower)) markers.push("FAKE_CREDENTIALS");
    if (/official website|government portal/.test(lower)) markers.push("AUTHORITY_CLAIM");
    if (/case number|complaint id|ticket/.test(lower)) markers.push("REFERENCE_NUMBER");
    if (/within \d+ hours|today|immediately/.test(lower)) markers.push("TIME_PRESSURE");

    return markers;
}

function getEmptyIntelligence() {
    return {
        emails: [], upiIds: [], phoneNumbers: [], phishingLinks: [],
        bankAccounts: [], ifscCodes: [], cryptoWallets: [], moneyAmounts: [],
        transactionIds: [], orderIds: [], banksImpersonated: [],
        authoritiesImpersonated: [], appsRequested: [], urgencyLevel: "LOW",
        tacticUsed: "UNKNOWN", threatType: "GENERIC", suspiciousKeywords: [],
        messageLength: 0, hasNumbers: false, hasLinks: false,
        scamType: "UNKNOWN", sophisticationLevel: "LOW", credibilityMarkers: [],
    };
}

// Urgency comparison helper
const URGENCY_ORDER = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };

function mergeAdvancedIntelligence(existing, newData) {
    return {
        emails: [...new Set([...existing.emails, ...newData.emails])],
        upiIds: [...new Set([...existing.upiIds, ...newData.upiIds])],
        phoneNumbers: [...new Set([...existing.phoneNumbers, ...newData.phoneNumbers])],
        phishingLinks: [...new Set([...existing.phishingLinks, ...newData.phishingLinks])],
        bankAccounts: [...new Set([...existing.bankAccounts, ...newData.bankAccounts])],
        ifscCodes: [...new Set([...existing.ifscCodes, ...newData.ifscCodes])],
        cryptoWallets: [...new Set([...existing.cryptoWallets, ...newData.cryptoWallets])],
        moneyAmounts: [...existing.moneyAmounts, ...newData.moneyAmounts],
        transactionIds: [...new Set([...existing.transactionIds, ...newData.transactionIds])],
        orderIds: [...new Set([...existing.orderIds, ...newData.orderIds])],
        banksImpersonated: [...new Set([...existing.banksImpersonated, ...newData.banksImpersonated])],
        authoritiesImpersonated: [...new Set([...existing.authoritiesImpersonated, ...newData.authoritiesImpersonated])],
        appsRequested: [...new Set([...existing.appsRequested, ...newData.appsRequested])],
        urgencyLevel: (URGENCY_ORDER[newData.urgencyLevel] || 0) > (URGENCY_ORDER[existing.urgencyLevel] || 0)
            ? newData.urgencyLevel : existing.urgencyLevel,
        tacticUsed: existing.tacticUsed === "UNKNOWN" ? newData.tacticUsed : existing.tacticUsed,
        threatType: existing.threatType === "GENERIC" ? newData.threatType : existing.threatType,
        suspiciousKeywords: [...new Set([...existing.suspiciousKeywords, ...newData.suspiciousKeywords])],
        messageLength: existing.messageLength + newData.messageLength,
        hasNumbers: existing.hasNumbers || newData.hasNumbers,
        hasLinks: existing.hasLinks || newData.hasLinks,
        scamType: existing.scamType === "UNKNOWN" ? newData.scamType : existing.scamType,
        sophisticationLevel: newData.sophisticationLevel,
        credibilityMarkers: [...new Set([...existing.credibilityMarkers, ...newData.credibilityMarkers])],
    };
}

module.exports = {
    extractAdvancedIntelligence,
    mergeAdvancedIntelligence,
    getEmptyIntelligence,
};
