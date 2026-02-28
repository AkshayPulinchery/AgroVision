"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Sprout, 
  Leaf, 
  FlaskConical, 
  MessageSquare, 
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { explainCropRecommendation } from "@/ai/flows/explain-crop-recommendation";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function RecommendationsPage() {
  const { toast } = useToast();
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);

  const handleGetExplanation = async (type: 'fertilizer' | 'crop_switch') => {
    setExplaining(true);
    
    if (simulationMode) {
      await new Promise(r => setTimeout(r, 1000));
      const simExplanation = type === 'fertilizer' 
        ? "SIMULATION: AI analysis of your soil telemetry indicates a specific depletion of Nitrogen in the upper 15cm of soil. This is likely due to the higher-than-average precipitation last month. The recommended 120kg/ha Nitrogen mix is calculated to restore the nutrient balance for optimal Wheat grain fill."
        : "SIMULATION: AI market forecasting and regional soil analysis suggests switching to Soybeans. Historical data for the Valley Basin shows that during 'La Niña' years, late-season rainfall patterns favor legumes. Additionally, market futures for Soybeans are currently trending 8% higher than Wheat, reducing your financial risk.";
      setExplanation(simExplanation);
      setExplaining(false);
      return;
    }

    try {
      const result = await explainCropRecommendation({
        recommendationType: type,
        originalCropType: "Wheat",
        soilPH: 6.8,
        rainfall: 850,
        temperature: 22,
        predictedYield: 3200,
        fertilizerRecommendation: type === 'fertilizer' ? { quantity: "120kg/ha Nitrogen, 40kg/ha Potash" } : undefined,
        cropSwitchRecommendation: type === 'crop_switch' ? { alternativeCrop: "Soybeans" } : undefined,
        reasoningContext: "Soil Nitrogen levels are dropping while late-season rainfall is predicted to be higher than average."
      });
      setExplanation(result.explanation);
    } catch (err) {
      console.error(err);
      toast({
        title: "AI Connection Issue",
        description: "Falling back to Simulation Mode for this explanation.",
        variant: "destructive"
      });
      setSimulationMode(true);
      handleGetExplanation(type);
    } finally {
      setExplaining(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Smart Recommendations</h1>
            <p className="text-muted-foreground">Tailored advice for your farm based on soil, weather, and market trends.</p>
          </div>
          <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1.5 rounded-full border">
            <Switch 
              id="rec-sim-mode" 
              checked={simulationMode} 
              onCheckedChange={setSimulationMode}
            />
            <Label htmlFor="rec-sim-mode" className="text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1.5">
              {simulationMode ? <AlertTriangle className="h-3 w-3 text-amber-500" /> : <BrainCircuit className="h-3 w-3 text-primary" />}
              {simulationMode ? "Simulation Mode" : "Cloud AI Mode"}
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fertilizer Rec */}
          <Card className="border-none shadow-lg overflow-hidden flex flex-col">
            <div className="bg-emerald-600 p-6 text-white">
              <div className="bg-white/20 p-3 rounded-full w-fit mb-4">
                 <FlaskConical className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold mb-1">Fertilizer Optimization</h2>
              <p className="text-emerald-100 text-sm">Boost yield with the right nutrient balance.</p>
            </div>
            <CardContent className="p-6 flex-1 space-y-6">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                 <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                 <div>
                    <div className="font-bold text-emerald-900">Recommended Mix</div>
                    <div className="text-emerald-800 text-sm">120kg/ha Nitrogen + 40kg/ha Potash</div>
                 </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Benefits</h4>
                <ul className="space-y-2">
                   <li className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Expect 15% yield increase
                   </li>
                   <li className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Improves soil health for next season
                   </li>
                </ul>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 gap-2 font-bold"
                onClick={() => handleGetExplanation('fertilizer')}
                disabled={explaining}
              >
                {explaining ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                Ask AI Why
              </Button>
            </CardContent>
          </Card>

          {/* Crop Switch Rec */}
          <Card className="border-none shadow-lg overflow-hidden flex flex-col">
            <div className="bg-accent p-6 text-accent-foreground">
              <div className="bg-black/10 p-3 rounded-full w-fit mb-4">
                 <Leaf className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold mb-1">Crop Switching Strategy</h2>
              <p className="text-accent-foreground/80 text-sm">Consider alternatives for better risk management.</p>
            </div>
            <CardContent className="p-6 flex-1 space-y-6">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                 <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                 <div>
                    <div className="font-bold text-amber-900">Switch Suggestion</div>
                    <div className="text-amber-800 text-sm">Switch from **Wheat** to **Soybeans**</div>
                 </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Market Factors</h4>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground">Soybean Price</div>
                      <div className="font-bold text-emerald-600">+8%</div>
                   </div>
                   <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground">Risk Level</div>
                      <div className="font-bold text-amber-600">Low</div>
                   </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 gap-2 font-bold"
                onClick={() => handleGetExplanation('crop_switch')}
                disabled={explaining}
              >
                {explaining ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                Ask AI Why
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Explanation Area */}
        {explanation && (
          <Card className="border-none shadow-2xl bg-white animate-in zoom-in-95 duration-300">
            <CardHeader className="border-b bg-primary/5">
              <div className="flex items-center gap-3">
                 <div className="bg-primary p-2 rounded-lg">
                    <BrainCircuit className="h-5 w-5 text-primary-foreground" />
                 </div>
                 <div>
                   <CardTitle className="text-lg">AI Agronomist's Reasoning</CardTitle>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                     {simulationMode ? "Simulated Pattern Matching" : "Live Neural Analysis"}
                   </p>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-emerald max-w-none text-lg text-foreground leading-relaxed whitespace-pre-wrap font-medium">
                {explanation}
              </div>
              <div className="mt-8 flex justify-end">
                 <Button onClick={() => setExplanation(null)} variant="ghost" className="font-bold">Dismiss Insight</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Alerts */}
        <Card className="border-destructive/20 bg-destructive/5">
           <CardContent className="p-6 flex items-start gap-4">
              <div className="bg-destructive/10 p-3 rounded-full text-destructive">
                 <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                 <h3 className="font-bold text-lg text-destructive">Climate Risk Alert</h3>
                 <p className="text-sm text-muted-foreground">
                    A late-season frost is predicted for the Valley Basin area. 
                    Ensure your Soybeans are properly covered or consider delaying harvest.
                 </p>
                 <Button variant="link" className="px-0 text-destructive font-bold mt-2">
                    Action Plan <ArrowRight className="h-4 w-4 ml-1" />
                 </Button>
              </div>
           </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
