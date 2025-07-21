import { createContext, useContext, useState, ReactNode } from "react";

interface UploadedFile {
  file: File;
  progress: number;
  uploaded: boolean;
}

interface UploadContextType {
  mdfFile: UploadedFile | null;
  setMdfFile: (file: UploadedFile | null) => void;
  artworkFile: UploadedFile | null;
  setArtworkFile: (file: UploadedFile | null) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};

export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const [mdfFile, setMdfFile] = useState<UploadedFile | null>(null);
  const [artworkFile, setArtworkFile] = useState<UploadedFile | null>(null);

  return (
    <UploadContext.Provider value={{ mdfFile, setMdfFile, artworkFile, setArtworkFile }}>
      {children}
    </UploadContext.Provider>
  );
};
