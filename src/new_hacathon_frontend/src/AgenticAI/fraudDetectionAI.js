import ollama from 'ollama';

export async function analyzeUniversityActivity(universityData) {
    // Validate input
    if (!universityData || typeof universityData !== 'object') {
        throw new Error('Invalid university data format');
    }

    const threshold = 100;
    const credentialsPushed = universityData.credentialsPushed;
    const percentageAbove = Math.round(((credentialsPushed - threshold) / threshold) * 100);

    // Hard enforce the rule before AI runs
    if (credentialsPushed <= threshold) {
        return {
            verdict: "legit",
            reason: `Normal activity: ${credentialsPushed} credentials/hour (≤${threshold} threshold)`,
            percentageAbove: 0,
            confidence: 100
        };
    }

    // Prepare AI prompt with exact percentage
    const prompt = `
University Activity Analysis:
- Institution: ${universityData.name}
- Credentials Issued: ${credentialsPushed} (${percentageAbove}% above threshold)
- Timeframe: ${universityData.timeFrame}

Analyze if this is likely fraudulent activity. Consider:
1. Normal range: ≤${threshold} credentials/hour
2. Exact percentage above threshold
3. Common fraud patterns

Respond in JSON format:
{
  "verdict": "fraud" or "legit",
  "reason": "brief technical explanation",
  "confidence": 0-100
}
`;

    try {
        const response = await ollama.chat({
            model: 'gemma:2b',
            messages: [{ role: 'user', content: prompt }],
            stream: false,
            options: {
                temperature: 0.3,
                format: 'json'
            }
        });

        let parsed;
        try {
            parsed = JSON.parse(response?.message?.content || '{}');
        } catch (e) {
            console.error("AI response parsing failed:", e);
            parsed = {};
        }

        // Calculate exact percentage for the reason
        const exactPercentageReason = `${percentageAbove}% above threshold (${credentialsPushed}/${threshold})`;

        return {
            verdict: parsed.verdict?.toLowerCase() === "legit" ? "legit" : "fraud",
            reason: parsed.reason
                ? `${parsed.reason} (${exactPercentageReason})`
                : `Suspicious activity: ${exactPercentageReason}`,
            confidence: Math.min(100, Math.max(0, parseInt(parsed.confidence) || 80)),
            percentageAbove
        };

    } catch (err) {
        console.error('AI analysis error:', err);
        return {
            verdict: "fraud",
            reason: `System error during analysis (${percentageAbove}% above threshold)`,
            confidence: 0,
            percentageAbove
        };
    }
}

export async function runFraudSimulation() {
    const testCases = [
        { name: "MIT", credentialsPushed: 90, timeFrame: "hour" },
        { name: "Stanford", credentialsPushed: 150, timeFrame: "hour" },
        { name: "Oxford", credentialsPushed: 102, timeFrame: "hour" },
        { name: "Harvard", credentialsPushed: 110, timeFrame: "hour" },
        { name: "ETH Zurich", credentialsPushed: 75, timeFrame: "hour" }
    ];

    const results = [];
    for (const uni of testCases) {
        try {
            const analysis = await analyzeUniversityActivity(uni);
            results.push({
                ...uni,
                ...analysis,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.error(`Error analyzing ${uni.name}:`, err);
            results.push({
                ...uni,
                verdict: "error",
                reason: "Analysis failed",
                confidence: 0,
                percentageAbove: 0
            });
        }
    }
    return results;
}
