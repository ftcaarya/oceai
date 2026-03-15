# OceAI - AI for the Ocean

Helping policymakers, researchers, and fishermen make informed decisions with AI trained on ocean data.

---

## What It Does

OceAI has three integrated features, all powered by fine-tuned language models trained on ocean-related data:

**1. Ocean Policy Chatbot**
Trained on maritime law, IPCC climate reports, government documents, and international regulations. Helps NGOs and policymakers draft policy arguments and understand the legal/scientific landscape around ocean issues.

**2. Ocean Research Chatbot**
Trained on current ocean research and academic knowledge. Helps student researchers and scientists find answers to ocean science questions and stay current with research.

**3. Fisherman's AI First Mate**
Takes real-time tidal data, weather conditions, and fish migration patterns and tells small-scale fishermen where and when they should actually cast their lines. Simple, practical, useful.

All three features share the same backend framework and can be accessed through a unified interface.

---

## Inspiration

We saw three separate problems:
- NGOs and policymakers struggle to synthesize complex international maritime law and climate science into coherent policy arguments
- Ocean researchers and students have to dig through hundreds of papers to find relevant information
- Small-scale fishermen don't have access to real-time, location-specific advice about when and where fish are actually biting

We realized we could solve all three with models trained on different ocean-related data. Instead of building three separate tools, we built one platform that handles all three use cases.

---

## How We Built It

**The Team:**
- **Arjun Prabhu** - Custom model development and fine-tuning
- **Aarnav Sathish** - Backend framework and API structure
- **Spencer Hirsch** - Backend/frontend integration
- **Aarya Raut** - UI/UX design and frontend implementation

**The Approach:**

We started with Mistral 3 as our base model, then fine-tuned it using QLoRA (Quantized Low Rank Adaptation). QLoRA let us efficiently train on large amounts of data without needing massive GPU resources - important when you're working in 36 hours.

For data, we compiled about 1,790 different sources:
- Government reports and policy documents
- Academic journals and research papers
- International law and maritime regulations
- Books, technical reports, and literature on ocean topics

We split the work: Arjun handled the model training and fine-tuning, Aarnav built out the FastAPI backend framework to handle all three features, Spencer connected everything together, and Aarya built an interface that actually makes sense to use.

The backend ingests different types of prompts and routes them to the right feature - policy questions get handled differently than fisherman queries, even though they're all running the same base model.

---

## Challenges We Ran Into

**1. Model Training at Scale**
We had 1,790 data sources. Getting all that into a format suitable for training, cleaning it, and actually fine-tuning a model in 36 hours seemed impossible at first. QLoRA helped a lot - it meant we didn't need enterprise-grade GPU setups.

**2. GitHub Organization with 4 People**
This was the real integration challenge. We had four people working on different parts simultaneously - model training, backend, integration, and frontend all happening at once with code constantly changing. We had to structure our GitHub properly from the start, follow branching strategies, and make sure features could be integrated without breaking each other. One person merging bad code breaks everyone else's work. We had to be disciplined about it.

**3. Maintaining Quality Across Features**
The policy chatbot needed to be accurate about law. The research chatbot needed to reference actual studies. The fisherman tool needed to be reliable. We couldn't just train once and call it done - we had to test and refine each feature separately while keeping them on the same codebase.

**4. Time Crunch**
36 hours to research, collect data, fine-tune a model, build a backend, build a frontend, and integrate everything. That's not a lot of time.

---

## What Surprised Us

We thought training a custom model would be the bottleneck. It wasn't. What actually made things work was the team. Four people, equal division of labor, everyone staying engaged the entire time, everyone ready to jump into whatever needed work next. When everyone wants to work and there's no dead weight, 36 hours is enough to ship something real.

We also underestimated how much time GitHub organization would matter. Spending an hour at the start on proper branch structure and coding standards probably saved us 6 hours of debugging and merge conflicts later.

---

## What We're Proud Of

✓ **Trained three separate fine-tuned models** that actually work and are specialized for their use cases, not generic chatbots

✓ **Integrated 1,790 data sources** into a coherent training dataset

✓ **Built it in 36 hours** with clean code and proper engineering practices, not a hacky mess

✓ **Actually useful output** - the policy chatbot helps draft arguments, the research chatbot finds relevant studies, the fisherman tool gives actionable advice

✓ **Scalable architecture** - adding a fourth or fifth feature would be straightforward now

✓ **Real integration** - three separate features working together through one backend, not glued together at the last minute

---

## What We Learned

**Technical:**
- QLoRA is genuinely useful for time-constrained model training
- GitHub discipline from hour 1 saves enormous amounts of time later
- Fine-tuning is easier than most people think if you have good data
- Domain-specific training works better than generic models for specific use cases

**Teamwork:**
- Parallel development works when everyone communicates clearly
- Clear task division means less stepping on toes
- Regular syncs (even quick ones) prevent duplicate work
- Everyone being invested in shipping matters way more than individual skill

**Product:**
- Three use cases sharing the same infrastructure is possible and actually makes sense
- Different users need different things even if they care about the same domain
- The fisherman tool is probably the most immediately useful of the three

---

## What's Next for OceAI

Right now this is a proof of concept that works. Next steps:

- **Polish the interface** - Aarya can keep improving the frontend to make it more polished
- **Expand the fisherman tool** - Add more fish species, more coastal regions, more accurate migration data
- **Real-world testing** - Get it in the hands of actual NGOs, researchers, and fishermen to see what breaks
- **Scale the training data** - We have 1,790 sources, but there's way more ocean data out there
- **Add feedback loops** - Let users tell us when the advice was wrong so we can improve

---

## Try It

The backend API is fully functional. You can query any of the three features:

```bash
# Policy question
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"type": "policy", "question": "What are the legal frameworks for offshore wind farms?"}'

# Research question
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"type": "research", "question": "What do we know about ocean acidification rates?"}'

# Fishing advice
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"type": "fisherman", "lat": 32.7157, "lon": -117.1611, "water_temp_f": 68}'
```

---

## The Stack

| Component | Technology |
|-----------|-----------|
| Base Model | Mistral 3 |
| Fine-tuning | QLoRA (Quantized Low Rank Adaptation) |
| Backend | FastAPI |
| Frontend | React + Vite |
| Tidal Data | NOAA API |
| Weather Data | Open-Meteo API |

---

**Built by Arjun Prabhu, Aarnav Sathish, Spencer Hirsch, and Aarya Raut**
