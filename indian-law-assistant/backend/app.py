from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import logging
import time
import os
from vector_store import get_vector_store, initialize_vector_store

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Indian Law Assistant API",
    description="Vector-based search API for Indian Legal Documents",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class QueryRequest(BaseModel):
    query: str = Field(..., description="Legal question or search query", min_length=1)
    top_k: int = Field(default=3, description="Number of results to return", ge=1, le=20)
    include_score: bool = Field(default=True, description="Include similarity scores in response")

class SearchResult(BaseModel):
    rank: int
    score: Optional[float] = None
    section: str
    title: str
    text: str
    source_file: str
    type: str
    part: Optional[str] = None

class QueryResponse(BaseModel):
    query: str
    results: List[SearchResult]
    total_results: int
    processing_time: float
    timestamp: str

class StatsResponse(BaseModel):
    total_documents: int
    model_name: str
    index_size: int
    source_files: List[str]
    document_types: Dict[str, int]
    status: str

class HealthResponse(BaseModel):
    status: str
    message: str
    vector_store_ready: bool
    total_documents: int

# Global variables
vector_store = None

@app.on_event("startup")
async def startup_event():
    """Initialize the vector store on startup"""
    global vector_store
    try:
        logger.info("Initializing vector store...")
        dataset_path = os.path.join(os.path.dirname(__file__), "dataset")
        vector_store = initialize_vector_store(dataset_path)
        logger.info("Vector store initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize vector store: {e}")
        # Don't fail startup - allow the API to run even if vector store fails
        vector_store = None

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Indian Law Assistant API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "stats": "/stats"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    global vector_store
    
    is_ready = vector_store is not None
    total_docs = 0
    
    if is_ready:
        try:
            stats = vector_store.get_stats()
            total_docs = stats.get("total_documents", 0)
        except:
            is_ready = False
    
    status = "healthy" if is_ready else "unhealthy"
    message = "API is running and vector store is ready" if is_ready else "API is running but vector store is not ready"
    
    return HealthResponse(
        status=status,
        message=message,
        vector_store_ready=is_ready,
        total_documents=total_docs
    )

@app.get("/stats", response_model=StatsResponse)
async def get_stats():
    """Get vector store statistics"""
    global vector_store
    
    if not vector_store:
        raise HTTPException(status_code=503, detail="Vector store not initialized")
    
    try:
        stats = vector_store.get_stats()
        return StatsResponse(
            total_documents=stats["total_documents"],
            model_name=stats["model_name"],
            index_size=stats["index_size"],
            source_files=stats["source_files"],
            document_types=stats["document_types"],
            status="ready"
        )
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get statistics: {str(e)}")

@app.post("/query", response_model=QueryResponse)
async def query_legal_documents(request: QueryRequest):
    """
    Query legal documents using vector search
    
    This endpoint accepts a legal question and returns the most relevant 
    sections from Indian legal documents.
    """
    global vector_store
    
    if not vector_store:
        raise HTTPException(status_code=503, detail="Vector store not initialized")
    
    start_time = time.time()
    
    try:
        logger.info(f"Processing query: {request.query}")
        
        # Search for relevant documents
        results = vector_store.search(request.query, request.top_k)
        
        # Convert to response format
        search_results = []
        for result in results:
            search_result = SearchResult(
                rank=result["rank"],
                score=result["score"] if request.include_score else None,
                section=result["section"],
                title=result["title"],
                text=result["text"],
                source_file=result["source_file"],
                type=result["type"],
                part=result.get("part")
            )
            search_results.append(search_result)
        
        processing_time = time.time() - start_time
        
        response = QueryResponse(
            query=request.query,
            results=search_results,
            total_results=len(search_results),
            processing_time=round(processing_time, 3),
            timestamp=time.strftime("%Y-%m-%d %H:%M:%S")
        )
        
        logger.info(f"Query processed in {processing_time:.3f}s, returned {len(search_results)} results")
        return response
        
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")

@app.post("/similar/{section}")
async def get_similar_sections(section: str, top_k: int = 3):
    """
    Find sections similar to a given section
    
    Args:
        section: The section identifier (e.g., "Article 21", "Section 420")
        top_k: Number of similar sections to return
    """
    global vector_store
    
    if not vector_store:
        raise HTTPException(status_code=503, detail="Vector store not initialized")
    
    try:
        similar_sections = vector_store.get_similar_sections(section, top_k)
        
        return {
            "section": section,
            "similar_sections": similar_sections,
            "count": len(similar_sections)
        }
        
    except Exception as e:
        logger.error(f"Error finding similar sections: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to find similar sections: {str(e)}")

@app.get("/documents")
async def list_source_documents():
    """List all source documents in the dataset"""
    global vector_store
    
    if not vector_store:
        raise HTTPException(status_code=503, detail="Vector store not initialized")
    
    try:
        stats = vector_store.get_stats()
        return {
            "source_files": stats["source_files"],
            "document_types": stats["document_types"],
            "total_documents": stats["total_documents"]
        }
    except Exception as e:
        logger.error(f"Error listing documents: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list documents: {str(e)}")

@app.post("/reload")
async def reload_vector_store(background_tasks: BackgroundTasks):
    """Reload the vector store (useful after adding new documents)"""
    def reload_task():
        global vector_store
        try:
            logger.info("Reloading vector store...")
            dataset_path = os.path.join(os.path.dirname(__file__), "dataset")
            vector_store = initialize_vector_store(dataset_path)
            logger.info("Vector store reloaded successfully")
        except Exception as e:
            logger.error(f"Failed to reload vector store: {e}")
    
    background_tasks.add_task(reload_task)
    return {"message": "Vector store reload initiated in background"}

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"HTTP error: {exc.status_code} - {exc.detail}")
    return {"error": exc.detail, "status_code": exc.status_code}

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unexpected error: {str(exc)}")
    return {"error": "Internal server error", "status_code": 500}

if __name__ == "__main__":
    import uvicorn
    
    # Run the server
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )