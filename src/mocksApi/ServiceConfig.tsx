import { http, HttpResponse } from 'msw';
interface Document {
  type: string;
  title: string;
  position: number;
}

const defaultData= [
  { type: "bank-draft", title: "Bank Draft", position: 0 },
  { type: "bill-of-lading", title: "Bill of Lading", position: 1 },
  { type: "invoice", title: "Invoice", position: 2 },
  { type: "bank-draft-2", title: "Bank Draft 2", position: 3 },
  { type: "bill-of-lading-2", title: "Bill of Lading 2", position: 4 },
];

let documents: Document[] = JSON.parse(localStorage.getItem('documents') || '[]')?.length ?  JSON.parse(localStorage.getItem('documents') || '[]') :defaultData
const updateLocalStorage = (data: Document[]): void => {
  localStorage.setItem('documents', JSON.stringify(data));
};

export const serviceConfig = [
  http.get('/api/documents', () => {
    return HttpResponse.json(documents);
  }),
  http.post('/api/documents', async ({ request }) => {
    const newDocument = await request.json();
    const typedDocument = newDocument as Document;
    documents.push(typedDocument);
    updateLocalStorage(documents);
    return HttpResponse.json(typedDocument, { status: 201 });
  }),

  http.put('/api/documents', async ({ request }) => {
    const updatedDocuments = await request.json();
    const typedDocuments = updatedDocuments as Document[];
    documents = typedDocuments;
    updateLocalStorage(typedDocuments);
    return HttpResponse.json(typedDocuments);
  }),
];
