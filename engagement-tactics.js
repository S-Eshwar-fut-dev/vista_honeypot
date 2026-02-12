/**
 * STRATEGIC SCAMMER ENGAGEMENT SYSTEM
 * Makes the honeypot UNDETECTABLE and HIGHLY ENGAGING
 */

/**
 * Calculate realistic response delay based on message complexity.
 * Real humans don't respond instantly.
 */
function calculateRealisticDelay(message, messageCount) {
    const baseDelay = 2000;
    const lengthDelay = Math.min(message.length * 50, 5000);
    const firstMessagePenalty = messageCount === 0 ? 3000 : 0;
    const humanVariance = Math.random() * 1500 + 500;
    const complexityBonus = message.includes("?") ? 1000 : 0;

    return baseDelay + lengthDelay + firstMessagePenalty + humanVariance + complexityBonus;
}

/**
 * Add realistic typos and mistakes.
 * Real victims make mistakes when stressed.
 */
function addRealisticMistakes(text, urgencyLevel) {
    if (Math.random() > 0.3) return text; // 70% chance of perfect text

    const mistakes = [
        (t) => t.replace(/the /g, "teh "),
        (t) => t.replace(/ing /g, "ign "),
        (t) => t.replace(/receive/g, "recieve"),
        (t) => t.replace(/account/g, "accont"),
        (t) => t.replace(/ss /g, "s "),
        (t) => t.replace(/ and /g, " adn "),
        (t) => t.replace(/ but /g, " btu "),
        (t) => t.replace(/please/g, "plese"),
    ];

    const mistake = mistakes[Math.floor(Math.random() * mistakes.length)];
    return mistake(text);
}

/**
 * Progressive compliance - don't give up data too easily.
 * Make scammer work for it.
 */
function getComplianceLevel(messageCount, scamType) {
    if (messageCount < 2) return "RESISTANT";
    if (messageCount < 5) return "HESITANT";
    if (messageCount < 8) return "COOPERATIVE";
    return "FULLY_COMPLIANT";
}

/**
 * Generate context-aware stalling tactics.
 */
function getStrategicStall(scamType, messageCount, personaName) {
    const stalls = {
        BANKING_FRAUD: [
            "sir my phone battery at 10%... can you wait 5 minutes while I charge?",
            "okay sir but internet very slow... page not loading properly",
            "sir I need to find my reading glasses first... give me 2 minutes",
            "trying sir but my son changed phone settings... everything different now",
        ],
        TECH_SUPPORT: [
            "sir which button to click... screen showing many options",
            "okay downloading... but showing 99% for long time... should I wait?",
            "sir my phone storage almost full... need to delete some photos first",
            "connection error showing... should I restart phone and call back?",
        ],
        LOTTERY_SCAM: [
            "bro seriously? can you send screenshot of winner list with my name?",
            "okay but first tell me exact prize amount in writing",
            "bhai let me google this company name first... one minute",
            "sounds good but why registration fee? prize winners pay fees?",
        ],
    };

    const typeStalls = stalls[scamType] || stalls.BANKING_FRAUD;
    return typeStalls[Math.min(messageCount, typeStalls.length - 1)];
}

/**
 * Inject cultural authenticity markers.
 * Makes persona MORE believable.
 */
function addCulturalContext(text, personaName) {
    const contexts = {
        Ramesh: [
            Math.random() > 0.8 ? " (today is pension day at bank)" : "",
            Math.random() > 0.9 ? " bhagwan kasam" : "",
        ],
        Rahul: [
            Math.random() > 0.8 ? " (exam week hai bro)" : "",
            Math.random() > 0.9 ? " roommate bola fraud hai" : "",
        ],
        Priya: [
            Math.random() > 0.8 ? " (kids school time)" : "",
            Math.random() > 0.9 ? " cooking chal raha hai" : "",
        ],
        Arun: [
            Math.random() > 0.8 ? " (lunch time rush)" : "",
            Math.random() > 0.9 ? " regular customer waiting" : "",
        ],
        Meena: [
            Math.random() > 0.8 ? " (prayer time now)" : "",
            Math.random() > 0.9 ? " husband used to handle this" : "",
        ],
        Vijay: [
            Math.random() > 0.8 ? " (standup meeting in 5 mins)" : "",
            Math.random() > 0.9 ? " VPN disconnected again" : "",
        ],
    };

    const personaContexts = contexts[personaName] || contexts.Ramesh;
    const context = personaContexts[Math.floor(Math.random() * personaContexts.length)];

    return text + context;
}

/**
 * Detect if scammer is getting suspicious.
 * Analyze their language for frustration.
 */
function detectScammerFrustration(scammerMessage) {
    const frustrationMarkers = [
        "hello?", "are you there", "listening?", "did you hear",
        "quickly", "fast", "hurry", "what are you doing",
        "simple process", "very easy", "just do it", "follow instruction",
    ];

    let score = 0;
    frustrationMarkers.forEach((marker) => {
        if (scammerMessage.toLowerCase().includes(marker)) score++;
    });

    return score >= 2;
}

/**
 * Adaptive response strategy based on scammer behavior.
 */
function getAdaptiveStrategy(scammerMessage, messageCount) {
    const isFrustrated = detectScammerFrustration(scammerMessage);

    if (isFrustrated) {
        return {
            compliance: "HIGH",
            responseTime: "FAST",
            tone: "APOLOGETIC",
            tactic: "SHOW_EFFORT",
        };
    }

    if (messageCount < 3) {
        return {
            compliance: "LOW",
            responseTime: "NORMAL",
            tone: "CONFUSED",
            tactic: "ASK_QUESTIONS",
        };
    }

    return {
        compliance: "MEDIUM",
        responseTime: "VARIED",
        tone: "TRYING",
        tactic: "FAKE_PROBLEMS",
    };
}

module.exports = {
    calculateRealisticDelay,
    addRealisticMistakes,
    getComplianceLevel,
    getStrategicStall,
    addCulturalContext,
    detectScammerFrustration,
    getAdaptiveStrategy,
};
