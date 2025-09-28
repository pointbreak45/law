#!/usr/bin/env python3
"""
Test script for Indian Law Assistant API
Run this to verify that the backend is working correctly
"""

import requests
import json
import time
import sys

API_BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            health = response.json()
            print(f"✅ Health check passed!")
            print(f"   Status: {health['status']}")
            print(f"   Vector store ready: {health['vector_store_ready']}")
            print(f"   Total documents: {health['total_documents']}")
            return True
        else:
            print(f"❌ Health check failed: HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_stats():
    """Test stats endpoint"""
    print("\n📊 Testing stats endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/stats", timeout=10)
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ Stats endpoint working!")
            print(f"   Model: {stats['model_name']}")
            print(f"   Documents: {stats['total_documents']}")
            print(f"   Source files: {', '.join(stats['source_files'])}")
            print(f"   Document types: {stats['document_types']}")
            return True
        else:
            print(f"❌ Stats endpoint failed: HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Stats endpoint failed: {e}")
        return False

def test_query(query_text, expected_type=None):
    """Test query endpoint"""
    print(f"\n❓ Testing query: '{query_text}'")
    try:
        payload = {
            "query": query_text,
            "top_k": 3,
            "include_score": True
        }
        
        start_time = time.time()
        response = requests.post(
            f"{API_BASE_URL}/query", 
            json=payload, 
            timeout=30,
            headers={"Content-Type": "application/json"}
        )
        processing_time = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Query successful!")
            print(f"   Processing time: {result['processing_time']:.3f}s (actual: {processing_time:.3f}s)")
            print(f"   Results found: {result['total_results']}")
            
            if result['results']:
                top_result = result['results'][0]
                print(f"   Top match: {top_result['section']} - {top_result['title']}")
                print(f"   Score: {top_result.get('score', 'N/A')}")
                print(f"   Type: {top_result['type']}")
                print(f"   Source: {top_result['source_file']}")
                
                # Check if expected type matches
                if expected_type and top_result['type'] != expected_type:
                    print(f"⚠️  Expected type '{expected_type}' but got '{top_result['type']}'")
                    return False
                    
                # Show text preview
                text_preview = top_result['text'][:200] + "..." if len(top_result['text']) > 200 else top_result['text']
                print(f"   Preview: {text_preview}")
            else:
                print("   No results found")
                return False
                
            return True
        else:
            print(f"❌ Query failed: HTTP {response.status_code}")
            try:
                error_detail = response.json()
                print(f"   Error: {error_detail}")
            except:
                print(f"   Raw response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Query failed: {e}")
        return False

def test_documents():
    """Test documents endpoint"""
    print("\n📚 Testing documents endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/documents", timeout=10)
        if response.status_code == 200:
            docs = response.json()
            print(f"✅ Documents endpoint working!")
            print(f"   Source files: {docs['source_files']}")
            print(f"   Document types: {docs['document_types']}")
            print(f"   Total documents: {docs['total_documents']}")
            return True
        else:
            print(f"❌ Documents endpoint failed: HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Documents endpoint failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🏛️  Indian Law Assistant API Test Suite")
    print("=" * 50)
    
    # Check if server is running
    print("🔌 Checking if backend server is running...")
    try:
        requests.get(f"{API_BASE_URL}/", timeout=5)
        print("✅ Backend server is responding")
    except requests.exceptions.RequestException:
        print("❌ Backend server is not responding!")
        print(f"   Make sure the server is running on {API_BASE_URL}")
        print("   Run: start-backend.bat")
        sys.exit(1)
    
    # Run tests
    tests_passed = 0
    total_tests = 0
    
    # Basic endpoint tests
    total_tests += 1
    if test_health():
        tests_passed += 1
        
    total_tests += 1
    if test_stats():
        tests_passed += 1
        
    total_tests += 1
    if test_documents():
        tests_passed += 1
    
    # Query tests
    test_queries = [
        ("What is Article 21?", "constitution"),
        ("Section 420 IPC", "ipc"),
        ("How to file FIR", "crpc"),
        ("What is a contract", "contract_act"),
        ("fundamental rights", "constitution"),
        ("theft punishment", "ipc"),
        ("anticipatory bail", "crpc")
    ]
    
    for query, expected_type in test_queries:
        total_tests += 1
        if test_query(query, expected_type):
            tests_passed += 1
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    print(f"Tests passed: {tests_passed}/{total_tests}")
    print(f"Success rate: {(tests_passed/total_tests)*100:.1f}%")
    
    if tests_passed == total_tests:
        print("\n🎉 All tests passed! Your API is working perfectly.")
        print("\n🚀 You can now start the frontend:")
        print("   Run: start-frontend.bat")
        print("   Then visit: http://localhost:3000")
    else:
        print(f"\n⚠️  {total_tests - tests_passed} tests failed.")
        print("   Check the backend logs for error details.")
        print("   Make sure all dependencies are installed correctly.")
        
    return tests_passed == total_tests

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)