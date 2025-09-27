import OpenAI from 'openai'

let _openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!_openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    _openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return _openaiClient
}

export const openai = new Proxy({} as OpenAI, {
  get(_, prop) {
    return (getOpenAIClient() as any)[prop]
  }
})

export interface TestMetadata {
  duration?: string | null
  temperature?: number | null
  humidity?: number | null
  notes?: string | null
  location?: string
}

export function buildMoldAnalysisPrompt(metadata: TestMetadata): string {
  let contextSection = ''
  
  if (metadata.duration || metadata.temperature || metadata.humidity || metadata.notes) {
    contextSection = '\n\nTEST CONDITIONS:\n'
    
    if (metadata.duration) {
      contextSection += `- Exposure Duration: ${metadata.duration}\n`
    }
    if (metadata.temperature) {
      contextSection += `- Temperature: ${metadata.temperature}°F\n`
    }
    if (metadata.humidity) {
      contextSection += `- Humidity: ${metadata.humidity}%\n`
    }
    if (metadata.location) {
      contextSection += `- Location: ${metadata.location}\n`
    }
    if (metadata.notes) {
      contextSection += `- Additional Notes: ${metadata.notes}\n`
    }
    
    contextSection += `
IMPORTANT: Consider these environmental conditions in your analysis:
- Longer exposure durations typically result in more colony growth
- Higher temperatures (70-90°F) favor rapid mold growth
- Higher humidity (>60%) significantly accelerates mold development
- Some species thrive in specific temperature/humidity ranges
- Growth patterns and colony counts should be interpreted relative to exposure time
`
  }

  return `You are an expert mycologist analyzing a petri dish sample for mold growth.

CRITICAL: Examine the ACTUAL image carefully. Look at the specific visual characteristics present.${contextSection}

First, observe these visual details:
1. Colony colors (white, green, black, yellow, orange, gray, etc.)
2. Colony textures (fuzzy, powdery, slimy, velvety, cottony)
3. Colony shapes (circular, irregular, spreading)
4. Growth patterns (clustered, isolated, spreading from center)
5. Size and number of visible colonies
6. Any unique features or characteristics

Based on your SPECIFIC observations of THIS image and the test conditions provided, provide analysis in JSON format:

{
  "visual_description": "Brief description of what you actually see in the image",
  "mold_types": [
    {
      "type": "Specific species name based on visual characteristics",
      "confidence": 85,
      "identifying_features": "Why you identified this species (color, texture, pattern)"
    }
  ],
  "overall_confidence": 90,
  "severity": "low/moderate/high",
  "colony_count": "low/moderate/high/extensive",
  "growth_density": "sparse/moderate/dense",
  "health_implications": "Specific health risks based on identified species",
  "recommendations": "Tailored recommendations based on severity and species"
}

Guidelines:
- Base identification on ACTUAL visual characteristics you observe
- Consider the environmental conditions when assessing severity and growth patterns
- Confidence should reflect image quality and clarity of identification
- Severity: low (1-3 small colonies), moderate (4-10 or larger colonies), high (extensive coverage or toxic species)
- Factor in exposure time: minimal growth after long exposure may indicate low contamination
- DO NOT default to generic "Penicillium + Aspergillus" - identify based on actual appearance
- If image quality prevents accurate identification, say so in visual_description and lower confidence
- Consider: Green/blue-green = likely Penicillium, Black = Aspergillus niger or Stachybotrys, White/cottony = various species
- Provide specific, actionable recommendations based on what you identified AND the test conditions

Respond ONLY with valid JSON. Be specific and evidence-based.`
}