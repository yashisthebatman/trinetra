import React, { createContext, useState, useContext, ReactNode } from 'react';
import { mockDocuments, MockDoc } from '../mock/mockDocuments';

// Define the shape of the context data
interface DocumentContextType {
  documents: MockDoc[];
  addDocument: (newDocument: MockDoc) => void;
}

// Create the context
const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Create the provider component
export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<MockDoc[]>(Object.values(mockDocuments));

  const addDocument = (newDocument: MockDoc) => {
    setDocuments(prevDocuments => [newDocument, ...prevDocuments]);
  };

  return (
    <DocumentContext.Provider value={{ documents, addDocument }}>
      {children}
    </DocumentContext.Provider>
  );
};

// Custom hook to easily use the context
export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};