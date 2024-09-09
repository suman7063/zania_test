import { http, HttpResponse } from 'msw';

// Define the type for a Document
interface Document {
  type: string;
  title: string;
  position: number;
}

// Initialize documents from localStorage or use default data
let documents: Document[] = JSON.parse(localStorage.getItem('documents') || '[]') || [
  { type: "bank-draft", title: "Bank Draft", position: 0 },
  { type: "bill-of-lading", title: "Bill of Lading", position: 1 },
  { type: "invoice", title: "Invoice", position: 2 },
  { type: "bank-draft-2", title: "Bank Draft 2", position: 3 },
  { type: "bill-of-lading-2", title: "Bill of Lading 2", position: 4 },
];

// Utility to update localStorage
const updateLocalStorage = (data: Document[]): void => {
  localStorage.setItem('documents', JSON.stringify(data));
};

export const serviceConfig = [
  // GET handler to fetch documents
  http.get('/api/documents', () => {
    return HttpResponse.json(documents); // Typed HttpResponse with documents data
  }),

  // POST handler to add a new document
  http.post('/api/documents', async ({ request }) => {
    const newDocument = await request.json();
    // Type assertion for the expected document type
    const typedDocument = newDocument as Document;
    documents.push(typedDocument);
    updateLocalStorage(documents);  // Update localStorage
    return HttpResponse.json(typedDocument, { status: 201 }); // Return new document with a 201 status
  }),

  // PUT handler to update the entire documents list
  http.put('/api/documents', async ({ request }) => {
    const updatedDocuments = await request.json();
    // Type assertion for the expected document array type
    const typedDocuments = updatedDocuments as Document[];
    documents = typedDocuments;
    updateLocalStorage(typedDocuments);  // Update localStorage
    return HttpResponse.json(typedDocuments); // Return updated documents
  }),
];
