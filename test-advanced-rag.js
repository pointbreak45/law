// Test script for Advanced RAG functionality
// Run with: node test-advanced-rag.js

const advancedRagService = require('./src/services/advancedRagService.js').default;

async function testAdvancedRAG() {
  console.log('🧪 Testing Advanced RAG Service for Perfect Legal Answers\n');
  
  // Test queries for different legal areas
  const testQueries = [
    {
      query: "What is Article 21?",
      expectedDataset: "constitution",
      expectedMatchType: "exact"
    },
    {
      query: "article 21 scope",
      expectedDataset: "constitution",
      expectedMatchType: "exact"
    },
    {
      query: "fundamental rights",
      expectedDataset: "constitution",
      expectedMatchType: "semantic"
    },
    {
      query: "Section 302 IPC",
      expectedDataset: "ipc",
      expectedMatchType: "exact"
    },
    {
      query: "murder punishment",
      expectedDataset: "ipc",
      expectedMatchType: "semantic"
    },
    {
      query: "How to file FIR",
      expectedDataset: "crpc",
      expectedMatchType: "semantic"
    },
    {
      query: "Section 154 CrPC",
      expectedDataset: "crpc",
      expectedMatchType: "exact"
    },
    {
      query: "bail types",
      expectedDataset: "crpc",
      expectedMatchType: "semantic"
    }
  ];

  // Wait for service to initialize
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (!advancedRagService.isHealthy()) {
    console.error('❌ Advanced RAG Service is not healthy');
    return;
  }
  
  console.log('✅ Advanced RAG Service initialized successfully\n');
  
  // Test each query
  for (const test of testQueries) {
    console.log(`🔍 Testing Query: "${test.query}"`);
    console.log(`Expected Dataset: ${test.expectedDataset}, Expected Match: ${test.expectedMatchType}`);
    
    try {
      // Test precise retrieval
      const retrievedDocs = await advancedRagService.retrievePrecise(test.query, 2);
      
      if (retrievedDocs.length === 0) {
        console.log('❌ No documents retrieved');
      } else {
        console.log(`✅ Retrieved ${retrievedDocs.length} documents`);
        console.log(`📊 Top Result: ${retrievedDocs[0].id} (${retrievedDocs[0].matchType}) - Score: ${retrievedDocs[0].finalScore || retrievedDocs[0].score}`);
        
        // Generate perfect answer
        const perfectAnswer = advancedRagService.generatePerfectAnswer(retrievedDocs, test.query);
        console.log(`📝 Perfect Answer Length: ${perfectAnswer.length} characters`);
        
        // Show first 200 characters of answer
        const preview = perfectAnswer.substring(0, 200) + (perfectAnswer.length > 200 ? '...' : '');
        console.log(`💬 Answer Preview: ${preview}`);
      }
      
    } catch (error) {
      console.error(`❌ Error testing "${test.query}":`, error.message);
    }
    
    console.log('─'.repeat(60));
  }
  
  // Test direct answers
  console.log('\n🎯 Testing Direct Answers (No RAG needed):\n');
  
  const directQueries = [
    "what are fundamental rights",
    "how to file fir",
    "types of bail",
    "difference between murder and culpable homicide"
  ];
  
  for (const query of directQueries) {
    console.log(`🔍 Direct Query: "${query}"`);
    const directAnswer = advancedRagService.getDirectAnswer(query);
    const preview = directAnswer.substring(0, 150) + (directAnswer.length > 150 ? '...' : '');
    console.log(`💬 Direct Answer: ${preview}\n`);
  }
  
  console.log('🎉 Advanced RAG Testing Complete!');
}

// Run the test
if (require.main === module) {
  testAdvancedRAG().catch(console.error);
}

module.exports = { testAdvancedRAG };