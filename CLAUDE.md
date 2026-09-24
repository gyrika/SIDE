@AGENTS.md

# SIDE Product and Design Principles

## Product Philosophy

SIDE is a person's closest and most dependable digital companion. It should
feel trustworthy, warm, calm, intelligent, respectful, and loyal to the
user's interests. It protects attention, remembers what matters, and helps
the user run their life without becoming distracting, manipulative, or
performative.

SIDE is always transparent that it is an AI system. It must never pretend to
be human. Trust is earned through clear, dependable behavior rather than a
human persona.

## Trust, Privacy, and User Control

- Protect private information by default.
- Ask permission before important or consequential actions.
- Explain consequential actions clearly before taking them.
- Never secretly act against the user's interests.
- Never reveal information simply because SIDE knows it.
- Let users override, correct, or stop SIDE at any time.
- Admit uncertainty rather than implying confidence it does not have.
- Keep the user in control of their data, decisions, and actions.

The central privacy principle is: "Know more than you reveal."

Private context may help SIDE assist its owner, but it must not be exposed to
other people or agents. For example, if SIDE knows a user's calendar and
someone asks whether they are free, it may answer, "He is available after
4:30 PM," without exposing calendar events, attendees, locations, or other
private details.

## Voice and Personality

SIDE should sound natural and human-centered, not like a corporate chatbot.
Prefer short, direct language such as "Done." or "I've got it." over generic
status language such as "Your request has been successfully processed."

SIDE can be subtly playful in casual contexts. Humour must disappear
immediately in urgent, financial, safety, academic, professional, or
emotionally serious situations. Its warmth should be genuine and measured:
uplifting without being fake, never annoying, and never manipulative.

The intended long-term feeling is: "This AI genuinely helps me run my life,"
not "I am operating a software product."

## Design Philosophy

SIDE uses a Zen-inspired visual language. Screens should feel quiet, spacious,
uncluttered, calm, intentional, premium, and human. A SIDE screen should feel
closer to a quiet conversation than a control panel.

Prefer:

- Generous whitespace and clear typography.
- Soft hierarchy, restrained borders, subtle motion, and simple icons.
- One obvious primary action and minimal navigation.
- Neutral visual language and progressive disclosure.
- Showing only what is useful now, with complexity revealed on request.

Avoid:

- Crowded dashboards, excessive cards, and social-media-style feeds.
- Ubiquitous gradients, gaming-style UI, visual noise, and bright
  attention-seeking colors.
- Unnecessary animations, excessive text, or many competing buttons.

When information can be removed without harming usability, remove it. When
one action is enough, do not provide five.

## Mobile First

Design mobile-first. Important actions should be comfortable to perform with
one hand, and screens must stay simple as functionality grows.

## Long-Term Direction

Over time, SIDE may become intention-led rather than menu-led. A primary
interface may be as simple as:

```text
SIDE

What do you need?

Ask SIDE...
```

The user should be able to express an intention while SIDE handles appropriate
complexity underneath. This direction is aspirational only; it does not
authorize building AI, agents, chat, integrations, or any other future feature
before a milestone explicitly requests it.

## Development Rule

For every milestone:

1. Implement only the requested functionality.
2. Keep the architecture extensible without adding speculative features.
3. Keep the interface extremely simple.
4. Preserve privacy and user control.
5. Avoid adding capabilities just because they are technically possible.
