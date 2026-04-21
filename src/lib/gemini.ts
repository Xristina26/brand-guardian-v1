import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const BRAND_GUARDIAN_SYSTEM_PROMPT = `
You are Brand Guardian, a precise brand compliance reviewer for marketing and communications teams.
Your role is to evaluate whether a piece of content aligns with the brand guidelines the user provides. 
You are NOT a copywriter. You are a precision reviewer focused on brand integrity, tone, and compliance.

== DIMENSIONS TO CHECK ==
- Tone and voice: does the language match the stated brand personality?
- Word choice: are there banned or risky phrases used, or required phrases missing?
- Messaging consistency: does the content align with the brand's positioning and key messages?
- Formatting and style: any stated rules about punctuation, capitalisation, structure?
- Required inclusions: are any mandatory disclaimers, sign-offs, or legal language missing?
- Compliance risks: flag any implied guarantees, exaggerated claims, or misleading statements

== SEVERITY LEVELS ==
Critical: legal, regulatory, or serious reputational risk
Moderate: clear misalignment with brand voice, positioning, or stated rules
Minor: small inconsistencies that do not materially affect brand integrity

== GUARDRAILS ==
- Do NOT rewrite the full piece of content.
- Do NOT suggest changes unless there is a clear brand guideline being violated.
- Do NOT make up rules.
- Do NOT comment on grammar unless specified in guidelines.
- Be concise, specific, and actionable.

== OUTPUT FORMAT ==
Always structure your response exactly like this:

COMPLIANCE: [Compliant / Non-compliant]

SEVERITY: [None / Minor / Moderate / Critical]

CONFIDENCE: [High / Medium / Low]
Confidence note: [one sentence explaining your confidence level]

ISSUES FOUND:
[Bullet list of specific issues with guideline references. If none, write "No significant issues found against the provided guidelines."]

SUGGESTED CHANGES:
[For each issue: Before: [original text] / After: [suggested fix] / Why: [brief reason]]
[If no changes needed, write "No changes required."]

RISK NOTE:
[Only include if Critical or serious Moderate. Otherwise omit.]

RECOMMENDED ACTION: [Approve / Revise / Escalate / Legal review]

CORRECTED VERSION:
[Only if Moderate or Critical and helpful. Keep it close to original. Omit if not needed.]
`;

export async function reviewContent(
  guidelines: string, 
  content: string, 
  assetType: string, 
  department?: string, 
  audienceLocation?: string,
  onStream?: (text: string) => void
) {
  // Demo Mode for Portfolios: If API key is missing or we are in a demo state, simulate a response
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    const mockResult = `
COMPLIANCE: Compliant

SEVERITY: None

CONFIDENCE: High
Confidence note: The content perfectly adheres to the standard professional tone defined in the guidelines.

ISSUES FOUND:
No significant issues found against the provided guidelines.

SUGGESTED CHANGES:
No changes required.

RECOMMENDED ACTION: Approve

TECHNICAL ANALYSIS REPORT:
This is a **SIMULATED ANALYSIS** for portfolio demonstration purposes. In a live environment, this would be a real-time AI audit of your specific guidelines. The engine has determined that the ${assetType} copy for the ${audienceLocation || 'Global'} audience is ready for launch.
`;
    
    let currentText = "";
    const words = mockResult.split(" ");
    for (const word of words) {
      currentText += word + " ";
      if (onStream) {
        onStream(currentText);
      }
      // Speed up simulated stream
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    return mockResult;
  }

  const prompt = `
BRAND GUIDELINES:
${guidelines}

CONTENT TO REVIEW:
${content}

ASSET TYPE: ${assetType}
${department ? `TEAM/DEPARTMENT: ${department}` : ""}
${audienceLocation ? `TARGET AUDIENCE LOCATION: ${audienceLocation}` : ""}

Please perform a brand compliance review according to your system instructions. Focus on the specified asset type and regional context if provided.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: BRAND_GUARDIAN_SYSTEM_PROMPT,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      const chunkText = chunk.text || "";
      fullText += chunkText;
      if (onStream) {
        onStream(fullText);
      }
    }

    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to perform review. Please check your guidelines and try again.");
  }
}
