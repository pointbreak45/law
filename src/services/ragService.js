// RAG (Retrieval-Augmented Generation) Service for LegalBot India
// Implements semantic search and retrieval from legal datasets

import constitutionData from '../../dataset/constitution-of-india.json';
import ipcData from '../../dataset/indian-penal-code.json';
import crpcData from '../../dataset/criminal-procedure-code.json';

class RAGService {
  constructor() {
    this.datasets = {
      constitution: constitutionData,
      ipc: ipcData,
      crpc: crpcData
    };
    
    // Initialize search indices
    this.searchIndex = null;
    this.initialized = false;
    this.initializeIndex();
  }

  // Initialize search index for fast retrieval
  async initializeIndex() {
    try {
      this.searchIndex = {
        constitution: this.buildSearchIndex(this.datasets.constitution),
        ipc: this.buildSearchIndex(this.datasets.ipc),
        crpc: this.buildSearchIndex(this.datasets.crpc)
      };
      this.initialized = true;
      console.log('RAG Service: Search indices initialized successfully');
    } catch (error) {
      console.error('RAG Service: Failed to initialize search indices:', error);
    }
  }

  // Build search index for a dataset
  buildSearchIndex(dataset) {
    const index = {
      keywords: {},
      content: [],
      sections: {}
    };

    // Index keywords
    if (dataset.keywords) {
      for (const [category, keywords] of Object.entries(dataset.keywords)) {
        keywords.forEach(keyword => {
          if (!index.keywords[keyword.toLowerCase()]) {
            index.keywords[keyword.toLowerCase()] = [];
          }
          index.keywords[keyword.toLowerCase()].push(category);
        });
      }
    }

    // Index content sections
    if (dataset.sections) {
      for (const [sectionName, sectionData] of Object.entries(dataset.sections)) {
        // Handle different data structures
        if (sectionData.articles) {
          // Constitution format
          for (const [articleKey, articleData] of Object.entries(sectionData.articles)) {
            const content = {
              id: articleKey,
              title: articleData.title,
              content: articleData.content,
              section: sectionName,
              type: 'article',
              searchableText: `${articleKey} ${articleData.title} ${articleData.content}`.toLowerCase()
            };
            index.content.push(content);
            index.sections[articleKey.toLowerCase()] = content;
          }
        } else if (typeof sectionData === 'object' && sectionData.title) {
          // IPC/CrPC format
          const content = {
            id: sectionName,
            title: sectionData.title,
            content: sectionData.content || sectionData.text,
            punishment: sectionData.punishment,
            procedure: sectionData.procedure,
            section: sectionName,
            type: 'section',
            searchableText: `${sectionName} ${sectionData.title} ${sectionData.content || sectionData.text || ''} ${sectionData.punishment || ''} ${sectionData.procedure || ''}`.toLowerCase()
          };
          index.content.push(content);
          index.sections[sectionName.toLowerCase()] = content;
        } else if (typeof sectionData === 'object') {
          // Nested sections
          for (const [subKey, subData] of Object.entries(sectionData)) {
            if (typeof subData === 'object' && subData.title) {
              const content = {
                id: subKey,
                title: subData.title,
                content: subData.content || subData.text,
                punishment: subData.punishment,
                procedure: subData.procedure,
                section: sectionName,
                subsection: subKey,
                type: 'section',
                searchableText: `${subKey} ${subData.title} ${subData.content || subData.text || ''} ${subData.punishment || ''} ${subData.procedure || ''}`.toLowerCase()
              };
              index.content.push(content);
              index.sections[subKey.toLowerCase()] = content;
            }
          }
        }
      }
    }

    return index;
  }

  // Main retrieval method
  async retrieve(query, maxResults = 5) {
    if (!this.initialized) {
      await this.initializeIndex();
    }

    const queryLower = query.toLowerCase();
    const results = [];

    // Determine which dataset(s) to search
    const relevantDatasets = this.identifyRelevantDatasets(query);

    for (const dataset of relevantDatasets) {
      const datasetResults = this.searchInDataset(queryLower, dataset, maxResults);
      results.push(...datasetResults);
    }

    // Sort by relevance score and limit results
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, maxResults);
  }

  // Identify which datasets are relevant for the query
  identifyRelevantDatasets(query) {
    const queryLower = query.toLowerCase();
    const datasets = [];

    // Constitutional keywords
    const constitutionKeywords = [
      'fundamental rights', 'article', 'constitution', 'preamble', 'directive principles',
      'equality', 'freedom', 'religion', 'education', 'supreme court', 'high court',
      'president', 'parliament', 'amendment', 'emergency'
    ];

    // IPC keywords
    const ipcKeywords = [
      'murder', 'theft', 'robbery', 'rape', 'hurt', 'cheating', 'forgery', 'section',
      'punishment', 'imprisonment', 'fine', 'offence', 'crime', 'criminal', 'ipc'
    ];

    // CrPC keywords
    const crpcKeywords = [
      'fir', 'arrest', 'bail', 'investigation', 'trial', 'evidence', 'witness',
      'magistrate', 'police', 'custody', 'procedure', 'crpc', 'cognizable'
    ];

    // Check relevance
    let constitutionScore = 0;
    let ipcScore = 0;
    let crpcScore = 0;

    constitutionKeywords.forEach(keyword => {
      if (queryLower.includes(keyword)) constitutionScore++;
    });

    ipcKeywords.forEach(keyword => {
      if (queryLower.includes(keyword)) ipcScore++;
    });

    crpcKeywords.forEach(keyword => {
      if (queryLower.includes(keyword)) crpcScore++;
    });

    // Add datasets based on relevance scores
    if (constitutionScore > 0) datasets.push('constitution');
    if (ipcScore > 0) datasets.push('ipc');
    if (crpcScore > 0) datasets.push('crpc');

    // If no specific dataset identified, search all
    if (datasets.length === 0) {
      datasets.push('constitution', 'ipc', 'crpc');
    }

    return datasets;
  }

  // Search within a specific dataset
  searchInDataset(query, datasetName, maxResults) {
    const index = this.searchIndex[datasetName];
    if (!index) return [];

    const results = [];
    const queryWords = query.split(/\s+/).filter(word => word.length > 2);

    // Search through content
    index.content.forEach(item => {
      let score = 0;

      // Exact section/article match gets highest score
      if (query.includes(item.id.toLowerCase())) {
        score += 100;
      }

      // Title match
      const titleLower = item.title.toLowerCase();
      if (titleLower.includes(query)) {
        score += 50;
      }

      // Keyword matching
      queryWords.forEach(word => {
        if (item.searchableText.includes(word)) {
          score += 10;
        }
        if (titleLower.includes(word)) {
          score += 20;
        }
      });

      // Content relevance
      const contentMatches = queryWords.filter(word => 
        item.searchableText.includes(word)
      ).length;
      score += contentMatches * 5;

      if (score > 0) {
        results.push({
          ...item,
          dataset: datasetName,
          score: score
        });
      }
    });

    // Sort by score and return top results
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, maxResults);
  }

  // Get specific section/article by ID
  getById(id, dataset = null) {
    const idLower = id.toLowerCase();
    
    if (dataset) {
      const index = this.searchIndex[dataset];
      return index ? index.sections[idLower] : null;
    }

    // Search across all datasets
    for (const [datasetName, index] of Object.entries(this.searchIndex)) {
      if (index.sections[idLower]) {
        return { ...index.sections[idLower], dataset: datasetName };
      }
    }

    return null;
  }

  // Get context for LLM based on retrieved documents
  getContext(retrievedDocs) {
    if (!retrievedDocs || retrievedDocs.length === 0) {
      return null;
    }

    const context = {
      dataset: retrievedDocs[0].dataset,
      retrievedContent: '',
      sources: []
    };

    retrievedDocs.forEach((doc, index) => {
      let docText = `${doc.id}: ${doc.title}\n${doc.content}`;
      
      if (doc.punishment) {
        docText += `\nPunishment: ${doc.punishment}`;
      }
      
      if (doc.procedure) {
        docText += `\nProcedure: ${doc.procedure}`;
      }

      context.retrievedContent += docText;
      if (index < retrievedDocs.length - 1) {
        context.retrievedContent += '\n\n---\n\n';
      }

      context.sources.push({
        id: doc.id,
        title: doc.title,
        dataset: doc.dataset,
        section: doc.section
      });
    });

    return context;
  }

  // Semantic similarity (basic implementation)
  calculateSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  // Get suggested queries based on current query
  getSuggestedQueries(query) {
    const suggestions = [];
    const queryLower = query.toLowerCase();

    // Predefined suggestions based on common legal topics
    const commonTopics = {
      'fundamental rights': [
        'What are the six fundamental rights in India?',
        'Right to equality under Article 14',
        'Freedom of speech and expression Article 19',
        'Right to life and liberty Article 21'
      ],
      'fir': [
        'How to file an FIR?',
        'What is the procedure for FIR registration?',
        'Can police refuse to register FIR?',
        'Time limit for filing FIR'
      ],
      'bail': [
        'What is anticipatory bail?',
        'Difference between bailable and non-bailable offences',
        'Conditions for granting bail',
        'Supreme Court bail guidelines'
      ],
      'murder': [
        'Difference between murder and culpable homicide',
        'Punishment for murder under IPC Section 302',
        'What constitutes attempt to murder?',
        'Self-defense and murder charges'
      ]
    };

    // Find relevant suggestions
    for (const [topic, topicSuggestions] of Object.entries(commonTopics)) {
      if (queryLower.includes(topic)) {
        suggestions.push(...topicSuggestions);
      }
    }

    return suggestions.slice(0, 4); // Return top 4 suggestions
  }

  // Get dataset statistics
  getStats() {
    return {
      constitution: {
        articles: this.searchIndex.constitution.content.length,
        sections: Object.keys(this.datasets.constitution.sections).length
      },
      ipc: {
        sections: this.searchIndex.ipc.content.length,
        categories: Object.keys(this.datasets.ipc.sections).length
      },
      crpc: {
        sections: this.searchIndex.crpc.content.length,
        procedures: Object.keys(this.datasets.crpc.sections).length
      },
      totalDocuments: this.searchIndex.constitution.content.length + 
                     this.searchIndex.ipc.content.length + 
                     this.searchIndex.crpc.content.length
    };
  }

  // Health check
  isHealthy() {
    return this.initialized && 
           this.searchIndex && 
           Object.keys(this.searchIndex).length === 3;
  }
}

// Export singleton instance
export default new RAGService();