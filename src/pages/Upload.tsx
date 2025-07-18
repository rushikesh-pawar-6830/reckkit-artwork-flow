import { useState, useRef, DragEvent } from "react";
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
  const [mdfFile, setMdfFile] = useState<UploadedFile | null>(null);
  const [artworkFile, setArtworkFile] = useState<UploadedFile | null>(null);
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
    <Card className="card-reckkit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Upload your {title.toLowerCase()} in PDF format
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!file ? (
          <div
            className="drag-zone cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, type)}
            onClick={() => inputRef.current?.click()}
          >
            <div className="text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Drop your PDF here</p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files
              </p>
              <Button variant="outline" className="btn-secondary-reckkit">
                Choose File
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {file.uploaded ? (
                  <CheckCircle className="h-6 w-6 text-success" />
                ) : (
                  <div className="spinner" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(type)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
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
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
            Upload Your Files
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload your Artwork and MDF PDF files for validation
          </p>
        </div>

        {/* Upload Sections */}
        <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
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
          <Button
            onClick={handleSubmit}
            disabled={!canProceed || isUploading}
            className={`btn-reckkit text-lg py-6 px-8 ${
              canProceed ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {canProceed ? (
              "Proceed to Validation"
            ) : (
              "Upload Files"
            )}
          </Button>
          
          {!canProceed && (
            <p className="text-sm text-muted-foreground mt-2">
              Upload both files to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;