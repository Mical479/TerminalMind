# Large Language Models (LLM)

## What is an LLM?

A Large Language Model is a neural network trained on vast amounts of text data to understand and generate human language.

### Key Characteristics

- **Scale**: Billions of parameters
- **Training**: Self-supervised learning on text
- **Capabilities**: Text generation, summarization, Q&A, coding, reasoning

## Transformer Architecture

The foundation of modern LLMs.

```
Input → Embedding → Positional Encoding → [Encoder/Decoder Layers] → Output
```

### Attention Mechanism

The core innovation of transformers:

```python
# Simplified attention
def attention(Q, K, V):
    scores = Q @ K.T / sqrt(d_k)
    weights = softmax(scores)
    return weights @ V
```

### Key Components

1. **Multi-Head Attention** - Multiple attention patterns in parallel
2. **Feed-Forward Networks** - Dense layers after attention
3. **Layer Normalization** - Stabilize training
4. **Residual Connections** - Enable deep networks

## Prompt Engineering

### Basic Techniques

| Technique | Description |
|-----------|-------------|
| Zero-shot | No examples, just instruction |
| Few-shot | 1-5 examples in prompt |
| Chain-of-Thought | Show reasoning steps |
| Zero-shot CoT | "Let's think step by step" |

### Best Practices

1. Be specific and clear
2. Use delimiters for structure
3. Break complex tasks into steps
4. Provide examples when helpful
5. Specify output format

## RAG (Retrieval-Augmented Generation)

Combine LLM with external knowledge:

```
Query → Retrieve (vector search) → Augment Prompt → LLM → Response
```

### When to Use RAG

- Need up-to-date information
- Domain-specific knowledge
- Factual accuracy important
- Large knowledge bases

## Fine-tuning

Adapt a pre-trained model to specific tasks.

### Approaches

1. **Full Fine-tuning** - Update all parameters
2. **LoRA** - Low-Rank Adaptation (efficient)
3. **QLora** - Quantized LoRA
4. **PEFT** - Parameter-Efficient Fine-Tuning

### When to Fine-tune

- Specific tone/style needed
- Task-specific patterns
- Cost-effective for many tasks
- Proprietary data patterns
