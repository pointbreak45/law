import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Types for API responses
export interface SearchResult {
  rank: number;
  score?: number;
  section: string;
  title: string;
  text: string;
  source_file: string;
  type: string;
  part?: string;
}

export interface QueryResponse {
  query: string;
  results: SearchResult[];
  total_results: number;
  processing_time: number;
  timestamp: string;
}

export interface StatsResponse {
  total_documents: number;
  model_name: string;
  index_size: number;
  source_files: string[];
  document_types: { [key: string]: number };
  status: string;
}

export interface HealthResponse {
  status: string;
  message: string;
  vector_store_ready: boolean;
  total_documents: number;
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response) {
      // Server responded with error status
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('No response received:', error.request);
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Query legal documents using the backend API
 */
export async function queryLawDataset(
  question: string,
  top_k: number = 3,
  include_score: boolean = true
): Promise<QueryResponse> {
  try {
    const response = await api.post<QueryResponse>('/query', {
      query: question,
      top_k,
      include_score,
    });

    return response.data;
  } catch (error) {
    console.error('Error querying law dataset:', error);
    throw new Error(
      axios.isAxiosError(error) && error.response?.data?.detail
        ? error.response.data.detail
        : 'Failed to query legal documents. Please check if the backend is running.'
    );
  }
}

/**
 * Get health status of the backend API
 */
export async function getHealthStatus(): Promise<HealthResponse> {
  try {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  } catch (error) {
    console.error('Error getting health status:', error);
    throw new Error('Failed to check backend status');
  }
}

/**
 * Get statistics about the legal document database
 */
export async function getStats(): Promise<StatsResponse> {
  try {
    const response = await api.get<StatsResponse>('/stats');
    return response.data;
  } catch (error) {
    console.error('Error getting stats:', error);
    throw new Error('Failed to get database statistics');
  }
}

/**
 * Find similar sections to a given section
 */
export async function getSimilarSections(
  section: string,
  top_k: number = 3
): Promise<{ section: string; similar_sections: SearchResult[]; count: number }> {
  try {
    const response = await api.post(`/similar/${encodeURIComponent(section)}?top_k=${top_k}`);
    return response.data;
  } catch (error) {
    console.error('Error getting similar sections:', error);
    throw new Error('Failed to find similar sections');
  }
}

/**
 * Get list of available legal documents
 */
export async function getDocuments(): Promise<{
  source_files: string[];
  document_types: { [key: string]: number };
  total_documents: number;
}> {
  try {
    const response = await api.get('/documents');
    return response.data;
  } catch (error) {
    console.error('Error getting documents:', error);
    throw new Error('Failed to get document list');
  }
}

/**
 * Format legal text for better display
 */
export function formatLegalText(text: string): string {
  // Add line breaks for better readability
  return text
    .replace(/\. /g, '.\n\n')
    .replace(/; /g, ';\n')
    .replace(/: /g, ':\n')
    .trim();
}

/**
 * Get document type icon and color
 */
export function getDocumentTypeInfo(type: string): { icon: string; color: string; label: string } {
  const typeMap: { [key: string]: { icon: string; color: string; label: string } } = {
    constitution: { icon: '⚖️', color: '#4f46e5', label: 'Constitution' },
    ipc: { icon: '🚨', color: '#dc2626', label: 'Indian Penal Code' },
    crpc: { icon: '👮', color: '#059669', label: 'Criminal Procedure Code' },
    contract_act: { icon: '📝', color: '#7c2d12', label: 'Contract Act' },
    legal: { icon: '📚', color: '#6366f1', label: 'Legal Document' },
  };

  return typeMap[type] || { icon: '📄', color: '#6b7280', label: 'Legal Document' };
}

/**
 * Extract section number from text
 */
export function extractSectionNumber(section: string): string {
  const match = section.match(/(?:Article|Section)\s*(\d+[A-Z]?)/i);
  return match ? match[1] : '';
}

/**
 * Generate suggested queries based on common legal topics
 */
export function getSuggestedQueries(): string[] {
  return [
    'What is Article 21 of the Constitution?',
    'How to file an FIR?',
    'What is the punishment for theft?',
    'What are fundamental rights?',
    'Section 420 IPC cheating',
    'Anticipatory bail provisions',
    'What is a valid contract?',
    'Right to equality Article 14',
    'Bailable vs non-bailable offences',
    'Section 144 CrPC prohibitory orders',
  ];
}

// Export default object with all functions
const ragService = {
  queryLawDataset,
  getHealthStatus,
  getStats,
  getSimilarSections,
  getDocuments,
  formatLegalText,
  getDocumentTypeInfo,
  extractSectionNumber,
  getSuggestedQueries,
};

export default ragService;