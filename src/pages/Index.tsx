import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, CheckCircle, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="h-8 w-8" />,
      title: "Easy Upload",
      description: "Drag and drop your PDF files for quick and secure upload"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Smart Validation",
      description: "Advanced AI-powered validation against industry standards"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Instant Results",
      description: "Get detailed validation reports in seconds"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-6">
              Reckkit
            </h1>
            <p className="text-2xl text-muted-foreground mb-4">
              Professional PDF Validation Platform
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Streamline your artwork validation process with our intelligent PDF checking system. 
              Ensure compliance, quality, and production readiness in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button 
                onClick={() => navigate("/login")}
                className="btn-reckkit text-lg py-6 px-8"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/login")}
                className="text-lg py-6 px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Choose Reckkit?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge technology with industry expertise to deliver 
            unparalleled PDF validation services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 animate-bounce-in">
          {features.map((feature, index) => (
            <Card key={index} className="card-reckkit text-center">
              <CardHeader>
                <div className="mx-auto text-primary mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-accent/50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Validate Your PDFs?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of professionals who trust Reckkit for their PDF validation needs.
          </p>
          <Button 
            onClick={() => navigate("/login")}
            className="btn-reckkit text-lg py-6 px-8"
          >
            Start Validating Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Reckkit. Professional PDF Validation Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
