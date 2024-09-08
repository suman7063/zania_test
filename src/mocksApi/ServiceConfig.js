import { http, HttpResponse } from 'msw';

// Initialize documents from localStorage or use default data
let documents = JSON.parse(localStorage.getItem('documents')) || [
  { type: "bank-draft", title: "Bank Draft", position: 0 },
  { type: "bill-of-lading", title: "Bill of Lading", position: 1 },
  { type: "invoice", title: "Invoice", position: 2 },
  { type: "bank-draft-2", title: "Bank Draft 2", position: 3 },
  { type: "bill-of-lading-2", title: "Bill of Lading 2", position: 4 },
];

// Utility to update localStorage
const updateLocalStorage = (data) => {
  localStorage.setItem('documents', JSON.stringify(data));
};

export const serviceConfig = [
  http.get('/api/documents', () => {
    return HttpResponse.json(documents);
  }),

  http.post('/api/documents', async ({ request }) => {
    const newDocument = await request.json();
    documents.push(newDocument);
    updateLocalStorage(documents);  // Update localStorage
    return HttpResponse.json(newDocument, { status: 201 });
  }),

  http.put('/api/documents', async ({ request }) => {
    const updatedDocuments = await request.json();
    documents = updatedDocuments;
    updateLocalStorage(updatedDocuments);  // Update localStorage
    return HttpResponse.json(updatedDocuments);
  })
];
