import { useState } from "react";
import { useUpload } from "../UploadContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  FileText,
  BarChart3,
  Palette,
  QrCode,
  Ruler,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'validating' | 'passed' | 'failed';
  details?: string;
  errorDetails?: string;
}

const Validation = () => {
  const { artworkFile } = useUpload();
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Ready to validate");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [cardLoading, setCardLoading] = useState<string | null>(null);
  const [cardResults, setCardResults] = useState<Record<string, any>>({});
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([
    {
      id: 'layout',
      name: 'Layout Verification',
      description: 'Checking document layout and structure',
      icon: <FileText className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: 'barcode',
      name: 'Barcode validation',
      description: 'Verifying barcode position and readability',
      icon: <QrCode className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: 'font',
      name: 'Font Matching',
      description: 'Checking size and margin requirements',
      icon: <Ruler className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: 'colors',
      name: 'Forbidden Color Check',
      description: 'Checking for forbidden colors',
      icon: <Palette className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: 'quality',
      name: 'Print Quality',
      description: 'Analyzing resolution and print readiness',
      icon: <BarChart3 className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: 'compliance',
      name: 'Regulatory Compliance',
      description: 'Checking industry standards compliance',
      icon: <Settings className="h-5 w-5" />,
      status: 'pending'
    }
  ]);

  const handleCardValidation = async (ruleId: string) => {
    if (!artworkFile?.file) {
      toast({
        title: "No Artwork File",
        description: "Please upload an artwork PDF before validating.",
        variant: "destructive"
      });
      return;
    }
    setCardLoading(ruleId);
    setValidationRules(rules => rules.map(rule => rule.id === ruleId ? { ...rule, status: 'validating' } : rule));
    try {
      let data: any = null;
      if (ruleId === 'barcode') {
        const formData = new FormData();
        formData.append('file', artworkFile.file);
        const response = await fetch("http://localhost:8000/validate_barcodes", {
          method: "POST",
          body: formData
        });
        if (!response.ok) throw new Error("Validation backend error");
        data = await response.json();
        setCardResults(results => ({ ...results, barcode: data }));
        const barcodes = data.results?.flatMap((page: any) => page.barcodes) || [];
        setValidationRules(rules => rules.map(rule => {
          if (rule.id === 'barcode') {
            if (barcodes.length > 0 && barcodes.every((b: any) => b.contrast_pass)) {
              return {
                ...rule,
                status: 'passed',
                details: `All barcodes passed contrast and were detected.`
              };
            } else {
              return {
                ...rule,
                status: 'failed',
                errorDetails: `Some barcodes failed contrast or were not detected.`
              };
            }
          }
          return rule;
        }));
      }
    } catch (error) {
      setValidationRules(rules => rules.map(rule => rule.id === ruleId ? { ...rule, status: 'failed', errorDetails: String(error) } : rule));
      toast({
        title: "Validation Error",
        description: String(error),
        variant: "destructive"
      });
    } finally {
      setCardLoading(null);
    }
  };

  const getStatusIcon = (status: ValidationRule['status']) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
      case 'validating':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = (status: ValidationRule['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'validating':
        return <Badge className="bg-primary text-primary-foreground">Validating...</Badge>;
      case 'passed':
        return <Badge className="bg-success text-success-foreground">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const passedCount = validationRules.filter(r => r.status === 'passed').length;
  const failedCount = validationRules.filter(r => r.status === 'failed').length;
  const totalCount = validationRules.length;

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-secondary/3">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-primary/8 to-secondary/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-secondary/8 to-primary/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 min-h-screen p-6">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center animate-fade-in">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-bounce-in">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary-glow bg-clip-text text-transparent mb-4">
                PDF Validation Suite
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive validation of your artwork PDF against industry standards and regulatory requirements
              </p>
              
              {/* Stats Bar */}
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-8 bg-card/80 backdrop-blur-sm rounded-2xl px-8 py-4 border border-border/50 shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{passedCount}</div>
                    <div className="text-sm text-muted-foreground">Passed</div>
                  </div>
                  <div className="w-px h-8 bg-border"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{failedCount}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="w-px h-8 bg-border"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totalCount}</div>
                    <div className="text-sm text-muted-foreground">Total Tests</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Validation Rules */}
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 animate-bounce-in">
            {validationRules.map((rule) => (
                <Card
                  key={rule.id}
                  className={`backdrop-blur-sm bg-card/95 border-0 shadow-xl hover:shadow-2xl cursor-pointer transition-all duration-500 group ${
                    rule.status === 'failed' ? 'ring-2 ring-destructive/30 shadow-destructive/10' :
                    rule.status === 'passed' ? 'ring-2 ring-success/30 shadow-success/10' : 
                    'hover:ring-2 hover:ring-primary/30'
                  }`}
                  onClick={() => setExpandedCard(expandedCard === rule.id ? null : rule.id)}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          rule.status === 'passed' ? 'bg-success/10 text-success' :
                          rule.status === 'failed' ? 'bg-destructive/10 text-destructive' :
                          rule.status === 'validating' ? 'bg-primary/10 text-primary' :
                          'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                        }`}>
                          {rule.icon}
                        </div>
                        <div>
                          <span className="text-lg font-semibold">{rule.name}</span>
                          {expandedCard === rule.id ? <ChevronUp className="inline ml-2 h-4 w-4" /> : <ChevronDown className="inline ml-2 h-4 w-4" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusIcon(rule.status)}
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{rule.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardTitle>
                    <CardDescription className="flex items-center justify-between mt-3">
                      <span className="text-base">{rule.description}</span>
                      {getStatusBadge(rule.status)}
                    </CardDescription>
                  </CardHeader>
                  {expandedCard === rule.id && (
                    <CardContent className="pt-0">
                      <div className="flex flex-col gap-6">
                        {/* Per-card validation trigger */}
                        <Button
                          disabled={cardLoading === rule.id}
                          onClick={e => { e.stopPropagation(); handleCardValidation(rule.id); }}
                          className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                          {cardLoading === rule.id ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Validating {rule.name}...
                            </>
                          ) : (
                            `Validate ${rule.name}`
                          )}
                        </Button>
                      {/* Show results for barcode validation as example */}
                      {rule.id === 'barcode' && cardResults.barcode && (
                        <div className="mt-2 p-2 border rounded bg-gray-50">
                          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(cardResults.barcode, null, 2)}</pre>
                        </div>
                      )}
                      {/* Show details/errors */}
                      {rule.details && <div className="text-green-700">{rule.details}</div>}
                      {rule.errorDetails && <div className="text-red-700">{rule.errorDetails}</div>}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
            {passedCount > 0 && (
              <div className="text-center animate-fade-in">
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-xl">
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-success to-secondary bg-clip-text text-transparent">
                    Validation Complete!
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                    Your PDF has been validated. Download your comprehensive validation report below.
                  </p>
                  <Button className="h-12 px-8 bg-gradient-to-r from-success to-secondary text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                    <FileText className="mr-2 h-5 w-5" />
                    Download Validation Report
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Validation;