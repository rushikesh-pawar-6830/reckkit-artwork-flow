import { useState, useRef, DragEvent } from "react";
import { useUpload } from "../UploadContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload as UploadIcon, File, CheckCircle, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UploadedFile {
  file: File;
  progress: number;
  uploaded: boolean;
}

const Upload = () => {
  const { mdfFile, setMdfFile, artworkFile, setArtworkFile } = useUpload();
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  
  const mdfInputRef = useRef<HTMLInputElement>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: DragEvent, type: 'mdf' | 'artwork') => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      handleFileSelect(pdfFile, type);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file only.",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (file: File, type: 'mdf' | 'artwork') => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file only.",
        variant: "destructive"
      });
      return;
    }

    const uploadedFile: UploadedFile = {
      file,
      progress: 0,
      uploaded: false
    };

    if (type === 'mdf') {
      setMdfFile(uploadedFile);
    } else {
      setArtworkFile(uploadedFile);
    }

    // Simulate file upload with progress
    simulateUpload(uploadedFile, type);
  };

  const simulateUpload = async (uploadedFile: UploadedFile, type: 'mdf' | 'artwork') => {
    setIsUploading(true);
    
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const updatedFile = { ...uploadedFile, progress };
      
      if (type === 'mdf') {
        setMdfFile(updatedFile);
      } else {
        setArtworkFile(updatedFile);
      }
    }

    const completedFile = { ...uploadedFile, progress: 100, uploaded: true };
    
    if (type === 'mdf') {
      setMdfFile(completedFile);
    } else {
      setArtworkFile(completedFile);
    }

    setIsUploading(false);
    
    toast({
      title: "Upload Complete!",
      description: `${type === 'mdf' ? 'MDF' : 'Artwork'} PDF uploaded successfully.`,
    });
  };

  const removeFile = (type: 'mdf' | 'artwork') => {
    if (type === 'mdf') {
      setMdfFile(null);
    } else {
      setArtworkFile(null);
    }
  };

  const handleSubmit = () => {
    if (!mdfFile?.uploaded || !artworkFile?.uploaded) {
      toast({
        title: "Upload Required",
        description: "Please upload both MDF and Artwork PDFs before proceeding.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Files Uploaded Successfully!",
      description: "Proceeding to validation...",
    });

    setTimeout(() => {
      navigate("/validation");
    }, 1500);
  };

  const FileUploadSection = ({ 
    title, 
    type, 
    file, 
    inputRef, 
    onFileSelect 
  }: {
    title: string;
    type: 'mdf' | 'artwork';
    file: UploadedFile | null;
    inputRef: React.RefObject<HTMLInputElement>;
    onFileSelect: (file: File) => void;
  }) => (
    <Card className="card-reckkit backdrop-blur-sm bg-card/95 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
            <File className="h-6 w-6 text-primary" />
          </div>
          {title}
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Upload your {title.toLowerCase()} in PDF format for validation
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!file ? (
          <div
            className="drag-zone cursor-pointer group-hover:border-primary/50 group-hover:bg-gradient-to-br group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-300"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, type)}
            onClick={() => inputRef.current?.click()}
          >
            <div className="text-center py-8">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UploadIcon className="h-10 w-10 text-primary group-hover:text-secondary transition-colors duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Drop your PDF here</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Drag and drop your file or click to browse from your device
              </p>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                Choose File
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-accent/50 to-accent/30 rounded-xl border border-border/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                  <File className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">{file.file.name}</p>
                  <p className="text-muted-foreground">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {file.uploaded ? (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-7 w-7" />
                    <span className="font-medium">Uploaded</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-primary">
                    <div className="spinner" />
                    <span className="font-medium">Uploading...</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(type)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {!file.uploaded && (
              <div className="space-y-2">
                <Progress value={file.progress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  Uploading... {file.progress}%
                </p>
              </div>
            )}
          </div>
        )}
        
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
          className="hidden"
        />
      </CardContent>
    </Card>
  );

  const canProceed = mdfFile?.uploaded && artworkFile?.uploaded;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-secondary/3">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-secondary/8 to-primary/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-bounce-in">
                <UploadIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary-glow bg-clip-text text-transparent mb-4">
              Upload Your Files
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your Artwork and MDF PDF files for comprehensive validation and quality assurance
            </p>
          </div>

          {/* Upload Sections */}
          <div className="grid lg:grid-cols-2 gap-8 animate-slide-up">
          <FileUploadSection
            title="Upload MDF PDF"
            type="mdf"
            file={mdfFile}
            inputRef={mdfInputRef}
            onFileSelect={(file) => handleFileSelect(file, 'mdf')}
          />
          
          <FileUploadSection
            title="Upload Artwork PDF"
            type="artwork"
            file={artworkFile}
            inputRef={artworkInputRef}
            onFileSelect={(file) => handleFileSelect(file, 'artwork')}
          />
        </div>

          {/* Submit Button */}
          <div className="text-center animate-bounce-in">
            <div className="space-y-6">
              <Button
                onClick={handleSubmit}
                disabled={!canProceed || isUploading}
                className={`h-16 px-12 text-xl font-semibold rounded-xl shadow-xl transition-all duration-300 ${
                  canProceed 
                    ? 'bg-gradient-to-r from-success to-secondary text-white hover:shadow-2xl hover:-translate-y-1 transform' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {canProceed ? (
                  <>
                    <CheckCircle className="mr-3 h-6 w-6" />
                    Proceed to Validation
                  </>
                ) : (
                  <>
                    <UploadIcon className="mr-3 h-6 w-6" />
                    Upload Both Files
                  </>
                )}
              </Button>
              
              {!canProceed && (
                <p className="text-muted-foreground max-w-md mx-auto">
                  Please upload both MDF and Artwork PDF files to continue with the validation process
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;