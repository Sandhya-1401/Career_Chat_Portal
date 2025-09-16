# import os
# from dotenv import load_dotenv
# import google.generativeai as genai
# from flask import Flask, render_template, request, jsonify

# # ───── Load API Key ─────
# load_dotenv()
# api_key = os.getenv("GOOGLE_API_KEY")
# if not api_key:
#     raise RuntimeError("GOOGLE_API_KEY not found in .env")

# genai.configure(api_key=api_key)

# model = genai.GenerativeModel("models/gemini-1.5-flash")

# # ───── Flask ─────
# app = Flask(__name__)

# def generate_response(user_query: str) -> str:
#     """Send prompt to Gemini and return Markdown text."""
#     try:
#         prompt = f"""
# You are a helpful career‑chatbot.  
# **Always return answers in Markdown**:

# • Use numbered or bullet lists with a blank line between items  
# • Put job titles in **bold**  
# • Keep paragraphs short (2–3 sentences)

# User: {user_query}
# """
#         response = model.generate_content(prompt)
#         return response.text
#     except Exception as e:
#         return f"Error generating response: {e}"

# @app.route("/")
# def index():
#     return render_template("index.html")

# @app.route("/get_response", methods=["POST"])
# def get_response():
#     user_query = request.form["user_query"]
#     return jsonify({"response": generate_response(user_query)})

# if __name__ == "__main__":
#     app.run(debug=True)



import os, google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, Response, stream_with_context

# ─── Load Gemini key ─────────────────────────────────────────
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise RuntimeError("GOOGLE_API_KEY not found in .env")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("models/gemini-1.5-flash")

# ─── Flask app ───────────────────────────────────────────────
app = Flask(__name__)

# ---------- helper: streaming generator ----------
def generate_streaming_response(user_query: str):
    prompt = f"""
You are a helpful career‑chatbot.  
**Always answer in Markdown**:

• Use numbered or bullet lists with a blank line between items  
• Put job titles in **bold**  
• Keep paragraphs short (2–3 sentences)

User: {user_query}
"""
    def stream():
        try:
            for chunk in model.generate_content(prompt, stream=True):
                if chunk.text:
                    yield chunk.text            # send raw text
        except Exception as e:
            yield f"\n\n⚠️ Error: {e}"

    # `text/plain` is fine because front‑end treats it as text stream
    return Response(stream_with_context(stream()),
                    content_type="text/plain; charset=utf-8")

# ---------- normal, non‑stream endpoint ----------
def generate_response(user_query: str) -> str:
    prompt = f"""
You are a helpful career‑chatbot.  
**Always answer in Markdown.**

User: {user_query}
"""
    try:
        return model.generate_content(prompt).text
    except Exception as e:
        return f"Error: {e}"

# ---------- routes ----------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_response", methods=["POST"])
def get_response():
    user_query = request.form["user_query"]
    return jsonify({"response": generate_response(user_query)})

@app.route("/stream_response", methods=["POST"])
def stream_response():
    user_query = request.form["user_query"]
    return generate_streaming_response(user_query)


@app.route("/job-search")
def job_search():
    return render_template("job_search.html")

@app.route("/profile-tips")
def profile_tips():
    return render_template("profile_tips.html")

@app.route("/resume")
def resume():
    return render_template("resume.html")

@app.route("/interview")
def interview():
    return render_template("interview.html")


# ---------- run ----------
if __name__ == "__main__":
    # threaded=True lets Flask keep the stream open while serving others
    app.run(debug=True, threaded=True)


