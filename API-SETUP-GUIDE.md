# API Setup Guide - LegalBot India

This guide will help you set up API keys for the LLM (Large Language Model) and RAG (Retrieval Augmented Generation) functionality.

## 🚀 Quick Start

1. **Copy the environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Choose your preferred AI provider** and get an API key from one of the following:

## 🔑 API Key Setup Options

### Option 1: OpenAI GPT (Recommended for Production)

**Provider**: OpenAI  
**Model**: GPT-3.5-turbo or GPT-4  
**Cost**: Pay per token  
**Quality**: High accuracy for legal content  

**Steps**:
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Add to your `.env` file:
   ```bash
   REACT_APP_LLM_PROVIDER=openai
   REACT_APP_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

**Pricing**: ~$0.002 per 1K tokens (very affordable for testing)

---

### Option 2: Google Gemini (Free Tier Available)

**Provider**: Google AI Studio  
**Model**: Gemini Pro  
**Cost**: Free tier available  
**Quality**: Excellent for Indian legal content  

**Steps**:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add to your `.env` file:
   ```bash
   REACT_APP_LLM_PROVIDER=gemini
   REACT_APP_GEMINI_API_KEY=your-gemini-api-key-here
   ```

**Pricing**: Free tier with 60 requests per minute

---

### Option 3: Anthropic Claude (High Quality)

**Provider**: Anthropic  
**Model**: Claude 3 Sonnet  
**Cost**: Pay per token  
**Quality**: Excellent reasoning for legal content  

**Steps**:
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account
3. Navigate to API Keys section
4. Generate new key
5. Add to your `.env` file:
   ```bash
   REACT_APP_LLM_PROVIDER=claude
   REACT_APP_CLAUDE_API_KEY=your-claude-api-key-here
   ```

---

### Option 4: Cohere (Good for Enterprises)

**Provider**: Cohere  
**Model**: Command Light  
**Cost**: Free tier available  
**Quality**: Good for general legal queries  

**Steps**:
1. Go to [Cohere Dashboard](https://dashboard.cohere.ai/api-keys)
2. Sign up or log in
3. Copy your API key from dashboard
4. Add to your `.env` file:
   ```bash
   REACT_APP_LLM_PROVIDER=cohere
   REACT_APP_COHERE_API_KEY=your-cohere-api-key-here
   ```

---

### Option 5: Hugging Face (Open Source)

**Provider**: Hugging Face  
**Model**: Various open source models  
**Cost**: Free with rate limits  
**Quality**: Variable depending on model  

**Steps**:
1. Go to [Hugging Face Tokens](https://huggingface.co/settings/tokens)
2. Create account or log in
3. Create new token with "Read" access
4. Copy the token
5. Add to your `.env` file:
   ```bash
   REACT_APP_LLM_PROVIDER=huggingface
   REACT_APP_HUGGINGFACE_API_KEY=your-hf-token-here
   ```

## 🔧 Configuration

After getting your API key, update your `.env` file:

```bash
# Choose one provider
REACT_APP_LLM_PROVIDER=openai  # or gemini, claude, cohere, huggingface

# Add your API key
REACT_APP_OPENAI_API_KEY=your-key-here

# Optional: Enable/disable features
REACT_APP_ENABLE_LLM=true
REACT_APP_ENABLE_RAG=true
REACT_APP_ENABLE_REALTIME=true
```

## 🧪 Testing Your Setup

1. **Start the application**:
   ```bash
   npm start
   ```

2. **Open the chatbot** and ask a test question:
   - "What is Article 21?"
   - "How to file an FIR?"
   - "Explain fundamental rights"

3. **Check the console** for any API errors

## 💰 Cost Estimates

| Provider | Free Tier | Paid Pricing | Best For |
|----------|-----------|--------------|----------|
| **OpenAI** | $5 credit | ~$0.002/1K tokens | Production use |
| **Gemini** | 60 req/min free | $0.00025/1K tokens | Development |
| **Claude** | None | ~$0.003/1K tokens | High quality |
| **Cohere** | 5M tokens/month | ~$0.0015/1K tokens | Enterprise |
| **Hugging Face** | Limited free | Variable | Open source |

## 🛡️ Security Best Practices

1. **Never commit API keys to version control**
2. **Use `.env` files** (already in `.gitignore`)
3. **Rotate keys regularly**
4. **Monitor usage** on provider dashboards
5. **Set usage limits** to prevent unexpected charges

## 🔄 Switching Providers

You can easily switch between providers by changing the `REACT_APP_LLM_PROVIDER` value:

```bash
# Switch to Gemini
REACT_APP_LLM_PROVIDER=gemini
REACT_APP_GEMINI_API_KEY=your-gemini-key

# Switch to OpenAI  
REACT_APP_LLM_PROVIDER=openai
REACT_APP_OPENAI_API_KEY=your-openai-key
```

The application will automatically use the configured provider.

## 🚨 Troubleshooting

### Common Issues:

1. **"No API key configured" error**:
   - Check your `.env` file exists
   - Verify the key name matches exactly
   - Restart the application after changes

2. **"401 Unauthorized" error**:
   - Verify API key is correct
   - Check if key has sufficient permissions
   - Ensure account has billing set up (if required)

3. **"Rate limit exceeded" error**:
   - Wait and try again
   - Consider upgrading to paid tier
   - Switch to different provider

4. **Network/CORS errors**:
   - Check internet connection
   - Some providers block browser requests (use backend proxy)

### Getting Help:

1. Check provider documentation
2. Look at browser console for detailed errors  
3. Test API key with provider's official tools first
4. Contact provider support if issues persist

## 🎯 Recommended Setup for Different Use Cases

### **For Development/Testing**:
- Use **Google Gemini** (free tier)
- Or **Hugging Face** (completely free)

### **For Production**:
- Use **OpenAI GPT-3.5-turbo** (reliable, cost-effective)
- Or **Claude 3 Sonnet** (highest quality)

### **For Enterprise**:
- Use **Cohere** (business-focused)
- Or **OpenAI GPT-4** (most capable)

## ✅ Verification Checklist

- [ ] API key obtained from provider
- [ ] `.env` file created and configured
- [ ] Provider set correctly
- [ ] Application restarted
- [ ] Test query returns response
- [ ] No console errors
- [ ] RAG system retrieving legal content
- [ ] Responses include disclaimer

---

**Need Help?** Check the provider's documentation or create an issue in the project repository.