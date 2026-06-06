SECTION_RULES = {
    "Aim": """
AIM:
- 15 to 30 words.
- Start with 'To'.
- One concise sentence.
""",

    "Theory": """
THEORY:
- 80 to 120 words.
- Maximum 2 paragraphs.
- Suitable for handwritten engineering record notebooks.
- Avoid textbook-style explanations.
- Focus only on concepts directly related to the experiment.
""",

    "Algorithm": """
ALGORITHM:
- 6 to 10 numbered steps.
- Keep each step short.
- One action per step.
""",

    "Result": """
RESULT:
- 20 to 40 words.
- Start with 'Thus'.
- Summarize the outcome only.
"""
}

def build_rules(selected_sections):

    rules = []

    for section in selected_sections:

        if section in SECTION_RULES:
            rules.append(SECTION_RULES[section])

    rules.append("""
GENERAL RULES:

- Generate ONLY the sections requested.
- Do not create extra sections.
- Use formal academic language.
- Avoid repetition.
- Follow the specified length requirements for each section.
- Provide enough detail for direct inclusion in an engineering laboratory record.
- Do not make sections overly brief.
- Use proper section headings.
""")

    return "\n".join(rules)