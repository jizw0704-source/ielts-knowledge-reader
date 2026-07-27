# IELTS Source Pool

## 1. Purpose

This document defines the long-term source pool for new IELTS Knowledge Reader articles.

The goal is not to copy IELTS passages or reproduce articles from other publishers. The source pool is used to:

- select topics with suitable academic depth;
- verify facts, terminology, and case studies;
- study the structure and tone of high-quality non-specialist writing;
- create original IELTS-style articles supported by traceable references.

All new articles must also follow:

- `docs/ARTICLE_SPEC.md`;
- `docs/CONTENT_PIPELINE.md`;
- `docs/IELTS_SOURCE_STYLE_GUIDE.md`;
- `docs/PROJECT_RULES.md`.

## 2. What IELTS Officially Uses

IELTS states that Academic Reading texts are drawn from books, journals, magazines, newspapers, and online resources. They are written for a non-specialist audience and may be narrative, descriptive, discursive, or argumentative.

Official references:

- [IELTS Academic Reading test format](https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-reading)
- [IELTS Academic Reading sample tasks](https://cdn.ielts.org/Sample-tests/ielts-academic-reading-sample-tasks-2023.pdf)
- [IELTS research on the Academic Reading construct](https://cdn.ielts.org/Research/cognitive-processes-underlying-academic-reading-construct-as-measured-by-ielts-wier-et-al-2009.pdf)

The official sample tasks contain verifiable examples adapted from or credited to:

- Scientific American;
- Encyclopaedia Britannica;
- The Atlantic;
- The Economist;
- Random House;
- Cambridge University Press.

These examples demonstrate the target source style. They do not form a complete public list of sources used in live IELTS tests.

## 3. Source Tiers

### Tier 1: Authoritative Fact Sources

Use these sources to verify scientific findings, statistics, definitions, public policy, and institutional claims.

| Area | Recommended sources |
| --- | --- |
| Health and society | WHO, OECD, national public-health agencies |
| Climate and environment | IPCC, UNEP, NASA Earth Observatory, NOAA |
| Food and ecosystems | FAO, UNEP, government environmental agencies |
| Cities and development | World Bank, World Resources Institute, UN-Habitat, city government reports |
| Science and research | Peer-reviewed journals, university research centres, national academies |
| History and culture | University museums, national museums, archives, Encyclopaedia Britannica |

Rules:

- Prefer the original report, paper, dataset, or institutional page.
- Check the publication date and whether the page has been updated.
- Do not rely on a press release as the only evidence for a disputed claim.
- Clearly distinguish research findings from projections, opinions, and policy proposals.

### Tier 2: IELTS-style Explanatory Sources

Use these sources for topic framing, explanatory structure, terminology, and examples suitable for educated non-specialists.

| Area | Recommended sources |
| --- | --- |
| Science and technology | Scientific American, New Scientist, Nature News and Features, MIT Technology Review, BBC Future |
| Environment and ecology | National Geographic, Smithsonian Magazine, The Conversation, NASA Earth Observatory |
| Society and cities | The Atlantic, The Economist, BBC Future, The Guardian long-form reporting |
| History and culture | Smithsonian Magazine, Aeon, university museum publications, Cambridge and Oxford general-interest books |
| Psychology and human behaviour | Scientific American, Psyche, Aeon, university research pages |

Rules:

- Use explanatory media to understand how a complex topic can be presented clearly.
- Verify important factual claims against Tier 1 sources where possible.
- A paywalled article may be a supplementary reference, but should not be the only source.
- Do not imitate distinctive wording, metaphors, paragraph order, or narrative scenes.

### Tier 3: Case-study and Current-context Sources

Use these sources for recent examples, locations, public debates, and practical consequences.

- Associated Press;
- Reuters;
- BBC News;
- The Guardian;
- The New Yorker;
- local or national government websites;
- university research news;
- public reports from cities and transport, health, or environmental authorities.

Rules:

- Separate the reported event from the journalist's interpretation.
- Cross-check unusually precise numbers or strong causal claims.
- Avoid building an entire article around one news report.
- Prefer stable URLs and sources that identify the author, date, and evidence.

## 4. Recommended Source Mix Per Article

Each new source-backed article should normally use two to four references:

1. One authoritative source for core facts or definitions.
2. One explanatory source for accessible background and terminology.
3. One case-study source for a concrete example.
4. Optionally, one source describing limitations, costs, uncertainty, or a competing view.

Recommended combinations:

| Article type | Suggested mix |
| --- | --- |
| Science explanation | research paper or institution + Scientific American or BBC Future + university case study |
| Environment | UNEP, NASA, or FAO + National Geographic or The Conversation + local project report |
| Cities and public health | WHO or OECD + The Atlantic or The Economist + city government or AP/Reuters case |
| History and culture | museum or university source + reference book + high-quality explanatory magazine |
| Technology and society | research institution + MIT Technology Review or New Scientist + policy or industry case |

## 5. Source Evaluation Checklist

Before a source is added to an article's `references`, confirm:

- The title, publisher, author or institution, and URL are identifiable.
- The URL opens and points to the original source where possible.
- The source is relevant to a specific fact, concept, example, or limitation.
- The publication date is appropriate for the claim.
- The source distinguishes evidence from opinion.
- Important statistics can be traced to an original report or study.
- The source does not require copying protected wording to be useful.
- The article can still be written in a new structure and original language.
- The source is not an anonymous content farm, scraped page, or low-quality SEO summary.
- The `usage` field honestly explains how the source informed the article.

## 6. Copyright and Originality Rules

The source pool does not grant permission to reproduce source text.

For every new article:

- use multiple sources rather than closely following one source;
- extract facts, concepts, questions, and terminology, not sentences;
- design a new outline before drafting;
- write every paragraph in original language;
- do not translate a source article into English or Chinese and present it as original;
- do not lightly rewrite a real IELTS or Cambridge IELTS passage;
- keep verbatim quotations out of the article unless separately approved and properly attributed;
- record sources in `references`, with a clear `usage` note;
- retain uncertainty and limitations when the evidence is not conclusive.

## 7. Standard Research Workflow

For each future daily article:

1. Select a topic with general academic interest.
2. Find one Tier 1 source.
3. Find one Tier 2 explanatory source.
4. Add a Tier 3 case study if it improves the article.
5. Record factual notes without copying source sentences.
6. Compare sources and identify agreement, uncertainty, and limitations.
7. Create a new IELTS-style outline.
8. Draft an original 750–900 word article.
9. Add `summaryZh`, `summaryEn`, `coreWords`, and `references`.
10. Generate article-level contextual vocabulary.
11. Run originality, URL, word-count, syntax, and regression checks.
12. Complete human review before publication.

## 8. Reference Data Requirements

New articles should use:

```js
references: [
  {
    title: '',
    source: '',
    url: '',
    usage: ''
  }
]
```

The `usage` field should state whether the reference informed:

- the topic;
- a factual claim;
- technical background;
- a case study;
- terminology;
- limitations or an alternative view.

It must also make clear that the article is original and is not a translation or close paraphrase.

## 9. Current Project Status

The current article library contains legacy original IELTS-style articles and one fully source-backed pilot article.

Legacy policy:

- do not invent references for older articles;
- do not attach a source merely because it discusses a similar topic;
- leave `references` absent or empty unless the article is genuinely reviewed against traceable sources;
- use the source-backed workflow for all new articles.

## 10. Recommended Topic Queue

The following topics fit the source pool and the IELTS Knowledge Reader format:

1. How Satellites Reveal Changes on Earth
2. Why Peatlands Matter for Climate and Water
3. How Animals Navigate Without Maps
4. Why Some Cities Are Removing Urban Highways
5. How Museums Protect Fragile Objects
6. The Science of Food Fermentation
7. How Artificial Light Changes Ecosystems
8. Why Social Connections Affect Public Health
9. How Rewilding Changes Landscapes
10. What Makes a Building Resilient to Earthquakes

Before development, each topic must still pass source availability, originality, and overlap checks.

## 11. Maintenance Rules

- Review this pool when an important source becomes unreliable or inaccessible.
- Add a new publication only after checking its editorial quality and relevance.
- Do not treat inclusion in this pool as automatic approval for every article.
- Prefer quality and source diversity over the number of references.
- Update the pool as a separate documentation task, not during unrelated UI or storage work.
