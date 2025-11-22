import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bureauNom, fieldName, minEvents = 10 } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Récupérer les événements récents pour ce bureau et ce champ
    const { data: events, error: eventsError } = await supabase
      .from('suggestions_events')
      .select('*')
      .eq('bureau_nom', bureauNom)
      .eq('field_name', fieldName)
      .order('created_at', { ascending: false })
      .limit(100);

    if (eventsError) throw eventsError;

    if (!events || events.length < minEvents) {
      return new Response(
        JSON.stringify({ 
          message: `Pas assez de données (${events?.length || 0}/${minEvents} événements)`,
          insights: null 
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // Préparer les données pour l'analyse
    const acceptedEvents = events.filter(e => e.action === 'accepted');
    const rejectedEvents = events.filter(e => e.action === 'rejected');
    
    const analysisData = {
      totalEvents: events.length,
      acceptedCount: acceptedEvents.length,
      rejectedCount: rejectedEvents.length,
      acceptanceRate: (acceptedEvents.length / events.length * 100).toFixed(2),
      acceptedValues: acceptedEvents.map(e => ({
        value: e.suggested_value,
        confidence: e.confidence,
        source: e.source
      })),
      rejectedValues: rejectedEvents.map(e => ({
        value: e.suggested_value,
        confidence: e.confidence,
        source: e.source
      }))
    };

    // Appeler Lovable AI pour analyser les patterns
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant IA spécialisé dans l'analyse de données pour améliorer un système de suggestions.
            
Ton rôle est d'analyser les événements de suggestions (acceptées/rejetées) et d'identifier:
1. Les patterns dans les valeurs acceptées vs rejetées
2. Les préférences spécifiques de l'utilisateur
3. Des recommandations pour améliorer les futures suggestions

Réponds UNIQUEMENT avec un objet JSON valide contenant:
{
  "patterns": ["description des patterns identifiés"],
  "preferences": ["préférences utilisateur déduites"],
  "recommendations": ["suggestions concrètes d'amélioration"],
  "confidenceScore": 0.XX (entre 0 et 1)
}`
          },
          {
            role: 'user',
            content: `Analyse ces données de suggestions pour le bureau "${bureauNom}" et le champ "${fieldName}":

Statistiques:
- Total événements: ${analysisData.totalEvents}
- Acceptées: ${analysisData.acceptedCount} (${analysisData.acceptanceRate}%)
- Rejetées: ${analysisData.rejectedCount}

Valeurs acceptées (5 dernières):
${JSON.stringify(analysisData.acceptedValues.slice(0, 5), null, 2)}

Valeurs rejetées (5 dernières):
${JSON.stringify(analysisData.rejectedValues.slice(0, 5), null, 2)}

Analyse ces données et fournis des insights pour améliorer les suggestions futures.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0]?.message?.content;
    
    if (!aiContent) {
      throw new Error('No content in AI response');
    }

    // Parser la réponse JSON de l'IA
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON in AI response');
    }
    
    const insights = JSON.parse(jsonMatch[0]);

    // Sauvegarder les insights dans la base de données
    const { error: upsertError } = await supabase
      .from('suggestions_insights')
      .upsert({
        bureau_nom: bureauNom,
        field_name: fieldName,
        insight_type: 'pattern',
        insight_data: insights,
        confidence_score: insights.confidenceScore || 0.5,
        based_on_events_count: events.length
      }, {
        onConflict: 'bureau_nom,field_name,insight_type'
      });

    if (upsertError) {
      console.error('Error saving insights:', upsertError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        insights,
        eventsAnalyzed: events.length
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in analyze-suggestions:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
