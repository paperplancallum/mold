-- Add mock analysis results for test E8AE9559
-- This will mark the test as completed with sample mold analysis data

-- First, update the test status to 'completed'
UPDATE tests 
SET status = 'completed' 
WHERE id::text LIKE 'e8ae9559%';

-- Insert mock analysis results
INSERT INTO analysis_results (
  test_id,
  mold_types,
  confidence,
  severity,
  colony_count_estimate,
  growth_density,
  health_implications,
  recommendations,
  raw_response
)
SELECT 
  id as test_id,
  '[
    {
      "type": "Aspergillus Niger",
      "confidence": 85,
      "identifying_features": "Dark brown to black colonies with granular texture, showing characteristic conidiophores"
    },
    {
      "type": "Penicillium",
      "confidence": 78,
      "identifying_features": "Blue-green powdery colonies with brush-like spore structures"
    },
    {
      "type": "Cladosporium",
      "confidence": 65,
      "identifying_features": "Olive-green to brown colonies with branching chains of conidia"
    }
  ]'::jsonb as mold_types,
  82 as confidence,
  'moderate' as severity,
  'moderate' as colony_count_estimate,
  'moderate' as growth_density,
  'Aspergillus Niger can cause respiratory issues in sensitive individuals. Penicillium may trigger allergic reactions. Cladosporium is generally less harmful but can affect those with asthma.' as health_implications,
  'Professional remediation recommended. Improve ventilation in the area. Fix any moisture sources. Consider air purification. Monitor for regrowth after treatment.' as recommendations,
  '{
    "mold_types": [
      {
        "type": "Aspergillus Niger",
        "confidence": 85,
        "identifying_features": "Dark brown to black colonies with granular texture"
      },
      {
        "type": "Penicillium", 
        "confidence": 78,
        "identifying_features": "Blue-green powdery colonies"
      },
      {
        "type": "Cladosporium",
        "confidence": 65,
        "identifying_features": "Olive-green to brown colonies"
      }
    ],
    "overall_confidence": 82,
    "severity": "moderate",
    "colony_count": "moderate",
    "growth_density": "moderate",
    "health_implications": "Aspergillus Niger can cause respiratory issues in sensitive individuals",
    "recommendations": "Professional remediation recommended"
  }'::jsonb as raw_response
FROM tests 
WHERE id::text LIKE 'e8ae9559%'
ON CONFLICT (test_id) DO NOTHING;