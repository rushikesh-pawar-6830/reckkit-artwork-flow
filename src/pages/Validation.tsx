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
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
              PDF Validation
            </h1>
            <p className="text-lg text-muted-foreground">
              Validate your artwork PDF against industry standards
            </p>
          </div>
          {/* Validation Rules */}
          <div className="grid md:grid-cols-2 gap-6 animate-bounce-in">
            {validationRules.map((rule) => (
              <Card
                key={rule.id}
                className={`card-reckkit cursor-pointer transition-all duration-300 ${
                  rule.status === 'failed' ? 'border-destructive/50' :
                  rule.status === 'passed' ? 'border-success/50' : ''
                }`}
                onClick={() => setExpandedCard(expandedCard === rule.id ? null : rule.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {rule.icon}
                      <span>{rule.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(rule.status)}
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{rule.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>{rule.description}</span>
                    {getStatusBadge(rule.status)}
                  </CardDescription>
                </CardHeader>
                {expandedCard === rule.id && (
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      {/* Per-card validation trigger */}
                      <Button
                        disabled={cardLoading === rule.id}
                        onClick={e => { e.stopPropagation(); handleCardValidation(rule.id); }}
                      >
                        {cardLoading === rule.id ? "Validating..." : `Validate ${rule.name}`}
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
          {failedCount === 0 && (
            <div className="mt-6 text-center">
              <Button className="btn-secondary-reckkit">
                Download Validation Report
              </Button>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Validation;