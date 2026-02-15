const { extractIntelligence, calculateRiskScore } = require('./extractor');

const testCases = [
    {
        text: "This is an urgent security alert for account 1234567890123456. To prevent a total freeze, you must verify your identity immediately. Click this link: http://secure-sbi-portal.net/verify and enter the OTP sent to 6789012345. If you have issues, email our technical team at support@sbi-security-dept.com.",
        expected: {
            bankAccounts: ['1234567890123456'],
            phoneNumbers: ['6789012345'],
            urls: true,
            emails: ['support@sbi-security-dept.com']
        }
    },
    {
        text: "Sir, we have detected a suspicious transfer to UPI ID: scammer.fraud@oksbi. This is urgent! To reverse this, we sent an OTP to 6789012345. Please provide it immediately along with confirmation of your bank account 1234567890123456. Failure to comply will result in account termination.",
        expected: {
            upiIds: ['scammer.fraud@oksbi'],
            phoneNumbers: ['6789012345'],
            bankAccounts: ['1234567890123456']
        }
    },
    // Adversarial Cases
    {
        text: "My number is 9876543210 call me.",
        expected: {
            phoneNumbers: ['9876543210'],
            bankAccounts: [] // Should be empty due to conflict resolution
        },
        desc: "Conflict Resolution: Phone vs Bank"
    },
    {
        text: "Transfer to account 50100234567890 immediately.",
        expected: {
            bankAccounts: ['50100234567890'],
            phoneNumbers: []
        },
        desc: "Long Bank Account"
    },
    {
        text: "Visit secure-sbi.net/login now.",
        expected: {
            phishingLinks: true // Should capture
        },
        desc: "Protocol-less URL"
    },
    {
        text: "Click https://bit.ly/scam-link for reward.",
        expected: {
            phishingLinks: true,
            keywords: ['url_shortener_detected']
        },
        desc: "URL Shortener Detection"
    }
];

console.log("🚀 Running Extractor 3.0 Tests & Risk Scoring...\n");

testCases.forEach((t, i) => {
    console.log(`\n--------------------------------------------------`);
    console.log(`📝 Test Case #${i + 1} (${t.desc || 'General'}):`);
    console.log(`"${t.text}"`);

    const result = extractIntelligence(t.text);
    const risk = calculateRiskScore(result);

    console.log(`\n🔍 Extracted Intelligence:`);
    console.log(JSON.stringify(result, null, 2));

    console.log(`\n⚠️ Risk Assessment:`);
    console.log(`Level: ${risk.level} (${risk.score}/100)`);
    console.log(`Factors: ${JSON.stringify(risk.factors)}`);

    let passed = true;

    // Simple Validation Logic
    if (t.expected.phoneNumbers) {
        if (JSON.stringify(result.phoneNumbers.sort()) !== JSON.stringify(t.expected.phoneNumbers.sort())) passed = false;
    }
    if (t.expected.bankAccounts) {
        if (JSON.stringify(result.bankAccounts.sort()) !== JSON.stringify(t.expected.bankAccounts.sort())) passed = false;
    }
    if (t.expected.upiIds) {
        if (JSON.stringify(result.upiIds.sort()) !== JSON.stringify(t.expected.upiIds.sort())) passed = false;
    }

    if (t.expected.phishingLinks === true && result.phishingLinks.length === 0) passed = false;
    if (t.expected.urls === true && result.phishingLinks.length === 0) passed = false;

    // Keyword check
    if (t.expected.keywords) {
        const hasKeywords = t.expected.keywords.every(k => result.suspiciousKeywords.includes(k));
        if (!hasKeywords) passed = false;
    }

    if (passed) {
        console.log(`\n✅ TEST PASSED`);
    } else {
        console.log(`\n❌ TEST FAILED`);
        console.log("Expected:", t.expected);
    }
});
