from dotenv import load_dotenv
import openai
import os

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_insights(problems):
    history = ""
    for p in problems:
        title = p.get("title", "Unknown")
        tags = ",".join(p.get("tags", []))
        attempts = p.get("attempts", [])
        history += f"{title} | Tags: {tags} | Attempts: {len(attempts)} | Optimal: {'yes' if any(a.get('isOptimal') for a in attempts) else 'no'} | Hint: {'yes' if any(a.get('usedHint') for a in attempts) else 'no'}\n"

    past_insight_block = "\n".join(past_insights)

    prompt = (
        "You're analyzing a LeetCode user's progress.\n"
        "Consider both their history and these past suggestions:\n"
        f"{past_insight_block}\n\n"
        "Now return 3–4 new bullet points. Use this format:\n"
        "- ✅ You are performing well in ...\n"
        "- ⚠️ You should improve in ...\n"
        "- 🧠 Try solving: ...\n"
        "- 💡 Tip: ...\n"
        "Do NOT repeat old suggestions. Do NOT include any extra text.\n\n"
        f"LeetCode History:\n{history}"
    )

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-0125",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=300,
    )

    return response.choices[0].message['content']