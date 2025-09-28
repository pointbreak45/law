import os
import json
import faiss
import numpy as np
from typing import List, Dict, Any, Tuple
from sentence_transformers import SentenceTransformer
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LegalVectorStore:
    """
    Vector store for Indian Legal Documents using FAISS and Sentence Transformers
    """
    
    def __init__(self, dataset_path: str = "dataset/", model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize the vector store
        
        Args:
            dataset_path: Path to the dataset directory containing JSON files
            model_name: Sentence transformer model name for embeddings
        """
        self.dataset_path = dataset_path
        self.model_name = model_name
        self.model = None
        self.index = None
        self.documents = []
        self.metadata = []
        
        # Initialize the model and build index
        self._load_model()
        self._load_documents()
        self._build_index()
    
    def _load_model(self):
        """Load the sentence transformer model"""
        try:
            logger.info(f"Loading sentence transformer model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    def _load_documents(self):
        """Load all JSON documents from the dataset directory"""
        logger.info(f"Loading documents from: {self.dataset_path}")
        
        if not os.path.exists(self.dataset_path):
            logger.error(f"Dataset path does not exist: {self.dataset_path}")
            return
        
        document_count = 0
        for filename in os.listdir(self.dataset_path):
            if filename.endswith('.json'):
                file_path = os.path.join(self.dataset_path, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    # Handle different JSON structures
                    if isinstance(data, list):
                        # Direct list of documents
                        for item in data:
                            self._process_document(item, filename)
                            document_count += 1
                    elif isinstance(data, dict):
                        # Handle nested structure like constitution
                        if 'parts' in data:
                            self._process_constitution(data, filename)
                            document_count += len(data.get('parts', {}))
                        elif 'sections' in data:
                            self._process_sections(data['sections'], filename)
                            document_count += len(data['sections'])
                        else:
                            # Single document
                            self._process_document(data, filename)
                            document_count += 1
                    
                except Exception as e:
                    logger.error(f"Error loading {filename}: {e}")
        
        logger.info(f"Loaded {document_count} documents from {len(os.listdir(self.dataset_path))} files")
    
    def _process_constitution(self, data: Dict, source_file: str):
        """Process constitution data with nested parts and articles"""
        for part_key, part_data in data.get('parts', {}).items():
            if isinstance(part_data, dict) and 'articles' in part_data:
                for article_key, article_data in part_data['articles'].items():
                    document = {
                        'section': article_key,
                        'title': article_data.get('title', ''),
                        'text': article_data.get('content', ''),
                        'part': part_data.get('title', ''),
                        'type': 'constitution'
                    }
                    self._add_document(document, source_file)
    
    def _process_sections(self, sections: List[Dict], source_file: str):
        """Process sections from legal documents"""
        for section in sections:
            self._process_document(section, source_file)
    
    def _process_document(self, item: Dict, source_file: str):
        """Process individual document"""
        self._add_document(item, source_file)
    
    def _add_document(self, document: Dict, source_file: str):
        """Add a document to the store"""
        # Create searchable text
        searchable_text = self._create_searchable_text(document)
        
        # Store document and metadata
        self.documents.append(searchable_text)
        self.metadata.append({
            'section': document.get('section', ''),
            'title': document.get('title', ''),
            'text': document.get('text', ''),
            'source_file': source_file,
            'type': document.get('type', 'legal'),
            'part': document.get('part', ''),
            'keywords': document.get('keywords', [])
        })
    
    def _create_searchable_text(self, document: Dict) -> str:
        """Create searchable text from document fields"""
        parts = []
        
        # Add section number/identifier
        if document.get('section'):
            parts.append(document['section'])
        
        # Add title
        if document.get('title'):
            parts.append(document['title'])
        
        # Add main text content
        if document.get('text'):
            parts.append(document['text'])
        
        # Add keywords if available
        if document.get('keywords'):
            if isinstance(document['keywords'], list):
                parts.extend(document['keywords'])
            else:
                parts.append(str(document['keywords']))
        
        return ' '.join(parts)
    
    def _build_index(self):
        """Build FAISS index from documents"""
        if not self.documents:
            logger.warning("No documents found to index")
            return
        
        logger.info("Building FAISS index...")
        
        try:
            # Generate embeddings
            embeddings = self.model.encode(self.documents, show_progress_bar=True)
            
            # Create FAISS index
            dimension = embeddings.shape[1]
            self.index = faiss.IndexFlatIP(dimension)  # Inner product for cosine similarity
            
            # Normalize embeddings for cosine similarity
            faiss.normalize_L2(embeddings)
            
            # Add embeddings to index
            self.index.add(embeddings.astype('float32'))
            
            logger.info(f"Index built successfully with {self.index.ntotal} documents")
            
        except Exception as e:
            logger.error(f"Error building index: {e}")
            raise
    
    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search for relevant documents
        
        Args:
            query: Search query
            top_k: Number of top results to return
            
        Returns:
            List of relevant documents with metadata and scores
        """
        if not self.index or not self.model:
            logger.error("Index or model not initialized")
            return []
        
        try:
            # Generate query embedding
            query_embedding = self.model.encode([query])
            faiss.normalize_L2(query_embedding)
            
            # Search
            scores, indices = self.index.search(query_embedding.astype('float32'), top_k)
            
            results = []
            for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
                if idx != -1:  # Valid index
                    result = {
                        'rank': i + 1,
                        'score': float(score),
                        'section': self.metadata[idx]['section'],
                        'title': self.metadata[idx]['title'],
                        'text': self.metadata[idx]['text'],
                        'source_file': self.metadata[idx]['source_file'],
                        'type': self.metadata[idx]['type'],
                        'part': self.metadata[idx]['part']
                    }
                    results.append(result)
            
            logger.info(f"Found {len(results)} results for query: {query}")
            return results
            
        except Exception as e:
            logger.error(f"Error during search: {e}")
            return []
    
    def get_stats(self) -> Dict[str, Any]:
        """Get statistics about the vector store"""
        stats = {
            'total_documents': len(self.documents),
            'model_name': self.model_name,
            'index_size': self.index.ntotal if self.index else 0,
            'source_files': list(set(meta['source_file'] for meta in self.metadata))
        }
        
        # Count by type
        type_counts = {}
        for meta in self.metadata:
            doc_type = meta['type']
            type_counts[doc_type] = type_counts.get(doc_type, 0) + 1
        
        stats['document_types'] = type_counts
        return stats
    
    def get_similar_sections(self, section: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Find similar sections to a given section"""
        # Find the section first
        section_text = None
        for i, meta in enumerate(self.metadata):
            if meta['section'].lower() == section.lower():
                section_text = self.documents[i]
                break
        
        if not section_text:
            return []
        
        return self.search(section_text, top_k + 1)[1:]  # Exclude the section itself


# Global vector store instance
vector_store = None

def get_vector_store() -> LegalVectorStore:
    """Get or create the global vector store instance"""
    global vector_store
    if vector_store is None:
        vector_store = LegalVectorStore()
    return vector_store

def initialize_vector_store(dataset_path: str = "dataset/"):
    """Initialize the vector store with custom dataset path"""
    global vector_store
    vector_store = LegalVectorStore(dataset_path)
    return vector_store