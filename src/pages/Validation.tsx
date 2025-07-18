import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Ready to validate");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
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
      name: 'Barcode Placement',
      description: 'Verifying barcode position and readability',
      icon: <QrCode className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: 'dimensions',
      name: 'Dimension Compliance',
      description: 'Checking size and margin requirements',
      icon: <Ruler className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: 'colors',
      name: 'Color Profile',
      description: 'Validating color spaces and profiles',
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

  const handleValidation = async () => {
    setIsValidating(true);
    setValidationProgress(0);
    
    // Reset all rules to pending
    setValidationRules(rules => rules.map(rule => ({ ...rule, status: 'pending' as const })));
    
    for (let i = 0; i < validationRules.length; i++) {
      const rule = validationRules[i];
      
      // Set current rule to validating
      setValidationRules(rules => 
        rules.map(r => 
          r.id === rule.id 
            ? { ...r, status: 'validating' as const }
            : r
        )
      );
      
      setCurrentStep(`Step ${i + 1}: ${rule.name}`);
      
      // Simulate validation time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly determine pass/fail for demo (weighted towards pass)
      const passed = Math.random() > 0.2; // 80% pass rate
      
      const updatedRule: ValidationRule = {
        ...rule,
        status: passed ? 'passed' : 'failed',
        details: passed 
          ? `${rule.name} completed successfully` 
          : `Issues found in ${rule.name.toLowerCase()}`,
        errorDetails: passed 
          ? undefined 
          : `Example error: ${rule.description} failed validation criteria. Please review and adjust according to specifications.`
      };
      
      setValidationRules(rules => 
        rules.map(r => r.id === rule.id ? updatedRule : r)
      );
      
      const progress = ((i + 1) / validationRules.length) * 100;
      setValidationProgress(progress);
    }
    
    setIsValidating(false);
    setCurrentStep("Validation Complete");
    
    const passedCount = validationRules.filter(r => r.status === 'passed').length;
    const totalCount = validationRules.length;
    
    if (passedCount === totalCount) {
      toast({
        title: "Validation Successful! ✅",
        description: "All validation rules passed. Your artwork is ready for production!",
      });
    } else {
      toast({
        title: "Validation Issues Found",
        description: `${totalCount - passedCount} issues found. Please review the failed items.`,
        variant: "destructive"
      });
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

          {/* Progress Section */}
          <Card className="card-reckkit animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Validation Progress</span>
                {(passedCount > 0 || failedCount > 0) && (
                  <div className="flex gap-2">
                    <Badge className="bg-success text-success-foreground">
                      {passedCount} Passed
                    </Badge>
                    {failedCount > 0 && (
                      <Badge variant="destructive">
                        {failedCount} Failed
                      </Badge>
                    )}
                  </div>
                )}
              </CardTitle>
              <CardDescription>{currentStep}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <Progress value={validationProgress} className="h-3" />
                <div className="text-center">
                  <Button
                    onClick={handleValidation}
                    disabled={isValidating}
                    className="btn-reckkit text-lg py-6 px-8"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Validating Artwork...
                      </>
                    ) : (
                      "Validate Artwork"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
                
                {(rule.details || rule.errorDetails) && (
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${
                        rule.status === 'failed' ? 'text-destructive' : 'text-success'
                      }`}>
                        {rule.details}
                      </p>
                      {(rule.errorDetails || rule.details) && (
                        <Button variant="ghost" size="sm">
                          {expandedCard === rule.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    
                    {expandedCard === rule.id && rule.errorDetails && (
                      <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20 animate-slide-up">
                        <h5 className="font-semibold text-destructive mb-2">Issue Details:</h5>
                        <p className="text-sm text-destructive/80">
                          {rule.errorDetails}
                        </p>
                      </div>
                    )}
                    
                    {expandedCard === rule.id && rule.status === 'passed' && (
                      <div className="mt-4 p-4 bg-success/10 rounded-lg border border-success/20 animate-slide-up">
                        <h5 className="font-semibold text-success mb-2">Validation Successful:</h5>
                        <p className="text-sm text-success/80">
                          This validation rule has been successfully completed. Your artwork meets the required standards for this criteria.
                        </p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Summary Section */}
          {(passedCount > 0 || failedCount > 0) && (
            <Card className="card-reckkit animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {failedCount === 0 ? (
                    <CheckCircle className="h-6 w-6 text-success" />
                  ) : (
                    <XCircle className="h-6 w-6 text-destructive" />
                  )}
                  Validation Summary
                </CardTitle>
                <CardDescription>
                  {failedCount === 0 
                    ? "Congratulations! Your artwork has passed all validation checks."
                    : `${failedCount} issue(s) found that need to be addressed before production.`
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{totalCount}</div>
                    <div className="text-sm text-muted-foreground">Total Checks</div>
                  </div>
                  <div className="p-4 bg-success/10 rounded-lg">
                    <div className="text-2xl font-bold text-success">{passedCount}</div>
                    <div className="text-sm text-muted-foreground">Passed</div>
                  </div>
                  <div className="p-4 bg-destructive/10 rounded-lg">
                    <div className="text-2xl font-bold text-destructive">{failedCount}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>
                
                {failedCount === 0 && (
                  <div className="mt-6 text-center">
                    <Button className="btn-secondary-reckkit">
                      Download Validation Report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Validation;