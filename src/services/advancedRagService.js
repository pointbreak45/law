// Advanced RAG Service for Perfect Legal Question Answering
// Provides precise, authoritative answers without suggestions

import constitutionData from '../../dataset/constitution-of-india.json';
import ipcData from '../../dataset/indian-penal-code.json';
import crpcData from '../../dataset/criminal-procedure-code.json';

class AdvancedRAGService {
  constructor() {
    this.datasets = {
      constitution: constitutionData,
      ipc: ipcData,
      crpc: crpcData
    };
    
    // Advanced search index with TF-IDF scoring
    this.searchIndex = null;
    this.vectorIndex = null;
    this.exactMatchIndex = null;
    this.initialized = false;
    
    // Legal terminology mapping
    this.legalTerms = this.buildLegalTermsMapping();
    
    this.initializeAdvancedIndex();
  }

  // Build comprehensive legal terms mapping
  buildLegalTermsMapping() {
    return {
      // Constitutional terms
      'fundamental rights': ['article 12', 'article 13', 'article 14', 'article 15', 'article 16', 'article 17', 'article 18', 'article 19', 'article 20', 'article 21', 'article 22', 'article 23', 'article 24', 'article 25', 'article 26', 'article 27', 'article 28', 'article 29', 'article 30', 'article 31', 'article 32'],
      'right to equality': ['article 14', 'article 15', 'article 16', 'article 17', 'article 18'],
      'right to freedom': ['article 19', 'article 20', 'article 21', 'article 22'],
      'right against exploitation': ['article 23', 'article 24'],
      'right to freedom of religion': ['article 25', 'article 26', 'article 27', 'article 28'],
      'cultural and educational rights': ['article 29', 'article 30'],
      'right to constitutional remedies': ['article 32'],
      'directive principles': ['article 36', 'article 37', 'article 38', 'article 39', 'article 40', 'article 41', 'article 42', 'article 43', 'article 44', 'article 45', 'article 46', 'article 47', 'article 48', 'article 49', 'article 50', 'article 51'],
      
      // Criminal law terms
      'murder': ['section 300', 'section 302'],
      'culpable homicide': ['section 299', 'section 304'],
      'theft': ['section 378', 'section 379', 'section 380'],
      'robbery': ['section 390', 'section 392'],
      'cheating': ['section 415', 'section 420'],
      'hurt': ['section 319', 'section 320', 'section 321', 'section 322'],
      'rape': ['section 375', 'section 376'],
      'kidnapping': ['section 359', 'section 360', 'section 361'],
      'forgery': ['section 463', 'section 464', 'section 465'],
      
      // Procedure terms
      'fir': ['section 154', 'section 155'],
      'arrest': ['section 41', 'section 50', 'section 56', 'section 57'],
      'bail': ['section 436', 'section 437', 'section 438', 'section 439'],
      'investigation': ['section 156', 'section 157', 'section 161', 'section 173'],
      'trial': ['section 190', 'section 207', 'section 239', 'section 240'],
      'evidence': ['section 161', 'section 164', 'section 165']
    };
  }

  // Initialize advanced indexing system
  async initializeAdvancedIndex() {
    try {
      this.searchIndex = this.buildAdvancedSearchIndex();
      this.exactMatchIndex = this.buildExactMatchIndex();
      this.vectorIndex = this.buildSimpleVectorIndex();
      this.initialized = true;
      console.log('Advanced RAG Service: All indices initialized successfully');
    } catch (error) {
      console.error('Advanced RAG Service: Failed to initialize indices:', error);
    }
  }

  // Build advanced search index with TF-IDF weighting
  buildAdvancedSearchIndex() {
    const index = {
      constitution: this.buildDatasetIndex(this.datasets.constitution, 'constitution'),
      ipc: this.buildDatasetIndex(this.datasets.ipc, 'ipc'),
      crpc: this.buildDatasetIndex(this.datasets.crpc, 'crpc')
    };
    
    return index;
  }

  // Build dataset-specific index
  buildDatasetIndex(dataset, datasetType) {
    const documents = [];
    const termFrequency = {};
    const documentFrequency = {};
    
    // Extract all documents
    if (dataset.parts) {
      for (const [partName, partData] of Object.entries(dataset.parts)) {
        this.extractDocuments(partData, partName, datasetType, documents);
      }
    } else if (dataset.sections) {
      for (const [sectionName, sectionData] of Object.entries(dataset.sections)) {
        this.extractDocuments(sectionData, sectionName, datasetType, documents);
      }
    }
    
    // Calculate TF-IDF
    documents.forEach((doc, docIndex) => {
      const words = this.tokenize(doc.searchableText);
      const wordCounts = {};
      
      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
        if (!documentFrequency[word]) {
          documentFrequency[word] = new Set();
        }
        documentFrequency[word].add(docIndex);
      });
      
      termFrequency[docIndex] = wordCounts;
    });
    
    // Calculate IDF scores
    const totalDocs = documents.length;
    const idfScores = {};
    for (const word in documentFrequency) {
      idfScores[word] = Math.log(totalDocs / documentFrequency[word].size);
    }
    
    return {
      documents,
      termFrequency,
      idfScores,
      totalDocuments: totalDocs
    };
  }

  // Extract documents from nested structure
  extractDocuments(data, sectionName, datasetType, documents) {
    if (data.articles) {
      // Constitution format
      for (const [articleKey, articleData] of Object.entries(data.articles)) {
        const doc = {
          id: articleKey,
          title: articleData.title,
          content: articleData.content,
          section: sectionName,
          type: 'article',
          dataset: datasetType,
          searchableText: this.buildSearchableText(articleKey, articleData.title, articleData.content),
          exactMatch: `${articleKey.toLowerCase()} ${articleData.title.toLowerCase()}`.split(/\s+/)
        };
        documents.push(doc);
      }
    } else if (data.title) {
      // Direct section
      const doc = {
        id: sectionName,
        title: data.title,
        content: data.content || data.text,
        punishment: data.punishment,
        procedure: data.procedure,
        section: sectionName,
        type: 'section',
        dataset: datasetType,
        searchableText: this.buildSearchableText(sectionName, data.title, data.content || data.text, data.punishment, data.procedure),
        exactMatch: `${sectionName.toLowerCase()} ${data.title.toLowerCase()}`.split(/\s+/)
      };
      documents.push(doc);
    } else if (typeof data === 'object') {
      // Nested sections
      for (const [subKey, subData] of Object.entries(data)) {
        if (typeof subData === 'object' && subData.title) {
          const doc = {
            id: subKey,
            title: subData.title,
            content: subData.content || subData.text,
            punishment: subData.punishment,
            procedure: subData.procedure,
            section: sectionName,
            subsection: subKey,
            type: 'section',
            dataset: datasetType,
            searchableText: this.buildSearchableText(subKey, subData.title, subData.content || subData.text, subData.punishment, subData.procedure),
            exactMatch: `${subKey.toLowerCase()} ${subData.title.toLowerCase()}`.split(/\s+/)
          };
          documents.push(doc);
        }
      }
    }
  }

  // Build searchable text with legal context
  buildSearchableText(id, title, content, punishment = '', procedure = '') {
    const text = `${id} ${title} ${content} ${punishment} ${procedure}`.toLowerCase();
    
    // Add legal synonyms and variations
    let enhancedText = text;
    
    // Add common variations
    if (text.includes('article')) {
      enhancedText += ' constitutional provision constitutional right';
    }
    if (text.includes('section')) {
      enhancedText += ' legal provision criminal law procedural law';
    }
    if (text.includes('fundamental right')) {
      enhancedText += ' basic right constitutional right human right';
    }
    if (text.includes('punishment')) {
      enhancedText += ' penalty sentence imprisonment fine';
    }
    
    return enhancedText;
  }

  // Build exact match index for precise queries
  buildExactMatchIndex() {
    const exactIndex = {};
    
    for (const [datasetName, datasetIndex] of Object.entries(this.searchIndex)) {
      exactIndex[datasetName] = {};
      
      datasetIndex.documents.forEach(doc => {
        // Index by ID
        exactIndex[datasetName][doc.id.toLowerCase()] = doc;
        
        // Index by title keywords
        const titleWords = this.tokenize(doc.title);
        titleWords.forEach(word => {
          if (!exactIndex[datasetName][word]) {
            exactIndex[datasetName][word] = [];
          }
          exactIndex[datasetName][word].push(doc);
        });
      });
    }
    
    return exactIndex;
  }

  // Build simple vector index for semantic similarity
  buildSimpleVectorIndex() {
    const vectorIndex = {};
    
    for (const [datasetName, datasetIndex] of Object.entries(this.searchIndex)) {
      vectorIndex[datasetName] = datasetIndex.documents.map(doc => ({
        ...doc,
        vector: this.createSimpleVector(doc.searchableText)
      }));
    }
    
    return vectorIndex;
  }

  // Create simple word vector for semantic matching
  createSimpleVector(text) {
    const words = this.tokenize(text);
    const vector = {};
    
    words.forEach(word => {
      vector[word] = (vector[word] || 0) + 1;
    });
    
    return vector;
  }

  // Advanced retrieval with precise matching
  async retrievePrecise(query, maxResults = 3) {
    if (!this.initialized) {
      await this.initializeAdvancedIndex();
    }

    const queryLower = query.toLowerCase();
    const queryTokens = this.tokenize(queryLower);
    
    // Step 1: Exact match search
    const exactMatches = this.findExactMatches(queryLower, queryTokens);
    
    // Step 2: Semantic search if no exact matches
    const semanticMatches = exactMatches.length === 0 ? 
      this.findSemanticMatches(queryTokens, maxResults) : [];
    
    // Step 3: Legal term expansion search
    const expandedMatches = exactMatches.length === 0 && semanticMatches.length === 0 ? 
      this.findExpandedMatches(queryLower, queryTokens, maxResults) : [];
    
    // Combine and rank results
    const allResults = [...exactMatches, ...semanticMatches, ...expandedMatches];
    const rankedResults = this.rankResults(allResults, queryTokens);
    
    return rankedResults.slice(0, maxResults);
  }

  // Find exact matches for precise queries
  findExactMatches(query, queryTokens) {
    const matches = [];
    
    for (const [datasetName, index] of Object.entries(this.exactMatchIndex)) {
      // Check for exact article/section matches
      for (const token of queryTokens) {
        if (index[token]) {
          const docs = Array.isArray(index[token]) ? index[token] : [index[token]];
          docs.forEach(doc => {
            matches.push({
              ...doc,
              score: 1000, // Highest priority for exact matches
              matchType: 'exact'
            });
          });
        }
      }
      
      // Check for ID matches (article 21, section 302, etc.)
      const idPattern = /(?:article|section)\s+(\d+[a-z]?)/gi;
      const idMatches = query.match(idPattern);
      
      if (idMatches) {
        idMatches.forEach(match => {
          const cleanMatch = match.toLowerCase().replace(/\s+/g, ' ').trim();
          if (index[cleanMatch]) {
            matches.push({
              ...index[cleanMatch],
              score: 1000,
              matchType: 'exact_id'
            });
          }
        });
      }
    }
    
    return this.deduplicateResults(matches);
  }

  // Find semantic matches using TF-IDF scoring
  findSemanticMatches(queryTokens, maxResults) {
    const matches = [];
    
    for (const [datasetName, datasetIndex] of Object.entries(this.searchIndex)) {
      const { documents, termFrequency, idfScores } = datasetIndex;
      
      documents.forEach((doc, docIndex) => {
        let score = 0;
        
        queryTokens.forEach(token => {
          if (termFrequency[docIndex] && termFrequency[docIndex][token]) {
            const tf = termFrequency[docIndex][token];
            const idf = idfScores[token] || 0;
            score += tf * idf;
          }
        });
        
        if (score > 0) {
          matches.push({
            ...doc,
            score: score,
            matchType: 'semantic'
          });
        }
      });
    }
    
    return matches.sort((a, b) => b.score - a.score).slice(0, maxResults);
  }

  // Find matches using legal term expansion
  findExpandedMatches(query, queryTokens, maxResults) {
    const matches = [];
    const expandedTokens = new Set(queryTokens);
    
    // Expand query using legal terms mapping
    for (const [term, relatedSections] of Object.entries(this.legalTerms)) {
      if (query.includes(term)) {
        relatedSections.forEach(section => {
          expandedTokens.add(section);
        });
      }
    }
    
    // Search with expanded terms
    const expandedQuery = Array.from(expandedTokens);
    return this.findSemanticMatches(expandedQuery, maxResults);
  }

  // Rank results based on relevance
  rankResults(results, queryTokens) {
    return results
      .map(result => ({
        ...result,
        finalScore: this.calculateFinalScore(result, queryTokens)
      }))
      .sort((a, b) => b.finalScore - a.finalScore);
  }

  // Calculate final relevance score
  calculateFinalScore(result, queryTokens) {
    let score = result.score || 0;
    
    // Boost for exact matches
    if (result.matchType === 'exact' || result.matchType === 'exact_id') {
      score *= 10;
    }
    
    // Boost for title matches
    const titleLower = result.title.toLowerCase();
    queryTokens.forEach(token => {
      if (titleLower.includes(token)) {
        score += 100;
      }
    });
    
    // Boost for ID matches
    const idLower = result.id.toLowerCase();
    queryTokens.forEach(token => {
      if (idLower.includes(token)) {
        score += 200;
      }
    });
    
    return score;
  }

  // Remove duplicate results
  deduplicateResults(results) {
    const seen = new Set();
    return results.filter(result => {
      const key = `${result.dataset}:${result.id}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Enhanced tokenization with legal context
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !this.isStopWord(word));
  }

  // Stop words filter
  isStopWord(word) {
    const stopWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with',
      'to', 'for', 'of', 'as', 'by', 'that', 'this', 'it', 'from', 'be', 'are', 'was',
      'were', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may',
      'might', 'must', 'can', 'shall', 'any', 'all', 'some', 'such', 'own', 'same'
    ]);
    
    return stopWords.has(word);
  }

  // Generate perfect answer without suggestions
  generatePerfectAnswer(retrievedDocs, query) {
    if (!retrievedDocs || retrievedDocs.length === 0) {
      return this.getDirectAnswer(query);
    }

    const primaryDoc = retrievedDocs[0];
    let answer = '';

    // Format the perfect answer based on document type
    if (primaryDoc.type === 'article') {
      answer = this.formatConstitutionalAnswer(primaryDoc);
    } else if (primaryDoc.type === 'section') {
      answer = this.formatSectionAnswer(primaryDoc);
    }

    // Add supporting information from additional docs
    if (retrievedDocs.length > 1) {
      const supportingInfo = this.formatSupportingInfo(retrievedDocs.slice(1));
      if (supportingInfo) {
        answer += '\n\n' + supportingInfo;
      }
    }

    return answer + '\n\n**Disclaimer: This is only for information, not legal advice.**';
  }

  // Format constitutional answer
  formatConstitutionalAnswer(doc) {
    let answer = `**${doc.id}: ${doc.title}**\n\n`;
    answer += doc.content;
    
    if (doc.section === 'fundamental_rights') {
      answer += '\n\nThis is a Fundamental Right guaranteed under Part III of the Indian Constitution.';
    } else if (doc.section === 'directive_principles') {
      answer += '\n\nThis is a Directive Principle of State Policy under Part IV of the Indian Constitution.';
    }
    
    return answer;
  }

  // Format section answer
  formatSectionAnswer(doc) {
    let answer = `**${doc.id}: ${doc.title}**\n\n`;
    answer += doc.content;
    
    if (doc.punishment) {
      answer += `\n\n**Punishment:** ${doc.punishment}`;
    }
    
    if (doc.procedure) {
      answer += `\n\n**Procedure:** ${doc.procedure}`;
    }
    
    return answer;
  }

  // Format supporting information
  formatSupportingInfo(docs) {
    if (docs.length === 0) return '';
    
    let info = '**Related Provisions:**\n';
    docs.forEach(doc => {
      info += `\n• **${doc.id}**: ${doc.title}`;
    });
    
    return info;
  }

  // Get direct answer for common queries
  getDirectAnswer(query) {
    const queryLower = query.toLowerCase();
    
    const directAnswers = {
      'what are fundamental rights': 'Fundamental Rights are basic rights guaranteed to all citizens by the Indian Constitution under Part III (Articles 12-35). These include: (1) Right to Equality (Articles 14-18), (2) Right to Freedom (Articles 19-22), (3) Right against Exploitation (Articles 23-24), (4) Right to Freedom of Religion (Articles 25-28), (5) Cultural and Educational Rights (Articles 29-30), and (6) Right to Constitutional Remedies (Article 32).',
      
      'how to file fir': 'To file an FIR under Section 154 CrPC: (1) Go to the nearest police station, (2) Give information orally or in writing about the cognizable offense, (3) Police will reduce oral information to writing, (4) The FIR will be read out to you, (5) Sign the FIR, (6) Get a copy with FIR number, (7) Police must register FIR for cognizable offenses - they cannot refuse.',
      
      'what is article 21': 'Article 21 states: "No person shall be deprived of his life or personal liberty except according to procedure established by law." The Supreme Court has expanded this to include right to livelihood, clean environment, privacy, speedy trial, dignified life, healthcare, education, and shelter.',
      
      'types of bail': 'There are three types of bail under CrPC: (1) Regular Bail (Section 437) - granted by Magistrate/Sessions Court after arrest, (2) Anticipatory Bail (Section 438) - granted by High Court/Sessions Court before arrest, (3) Interim Bail - temporary bail pending regular bail application.',
      
      'difference between murder and culpable homicide': 'Murder (Section 300) requires intention to cause death or knowledge that act is likely to cause death, punishable with death or life imprisonment. Culpable Homicide (Section 299) is causing death without premeditation, punishable with imprisonment up to 10 years. Murder is culpable homicide with specific intention or knowledge.'
    };
    
    // Find matching direct answer
    for (const [key, answer] of Object.entries(directAnswers)) {
      if (queryLower.includes(key) || this.calculateSimilarity(queryLower, key) > 0.7) {
        return answer + '\n\n**Disclaimer: This is only for information, not legal advice.**';
      }
    }
    
    return 'I can provide information on Indian Constitutional law, Indian Penal Code, and Criminal Procedure Code. Please ask about specific Articles, Sections, or legal procedures. **Disclaimer: This is only for information, not legal advice.**';
  }

  // Calculate text similarity
  calculateSimilarity(text1, text2) {
    const words1 = this.tokenize(text1);
    const words2 = this.tokenize(text2);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  // Get enhanced context for LLM
  getEnhancedContext(retrievedDocs) {
    if (!retrievedDocs || retrievedDocs.length === 0) {
      return null;
    }

    const context = {
      dataset: retrievedDocs[0].dataset,
      retrievedContent: '',
      sources: [],
      matchType: retrievedDocs[0].matchType || 'semantic'
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
        section: doc.section,
        score: doc.finalScore || doc.score
      });
    });

    return context;
  }

  // Health check for service
  isHealthy() {
    return this.initialized && 
           this.searchIndex && 
           this.exactMatchIndex && 
           this.vectorIndex &&
           Object.keys(this.searchIndex).length === 3;
  }
}

// Export singleton instance
export default new AdvancedRAGService();