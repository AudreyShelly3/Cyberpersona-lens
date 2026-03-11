from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# -------- MOCK DATABASE (Simulates Breach Results) -------- #
MOCK_BREACHES = [
    {"name": "Adobe", "year": 2013, "exposed_data": "Emails, Passwords"},
    {"name": "LinkedIn", "year": 2012, "exposed_data": "Emails, Password Hashes"},
    {"name": "Dropbox", "year": 2012, "exposed_data": "Emails, Passwords"},
    {"name": "Facebook", "year": 2019, "exposed_data": "Emails, Phone Numbers"},
    {"name": "Canva", "year": 2019, "exposed_data": "Emails, Password Hashes"}
]

def get_mock_breaches(email):
    """Simulates API breach lookup with randomised results."""
    random_count = random.randint(0, 4)
    breaches = random.sample(MOCK_BREACHES, random_count)
    return breaches

def calculate_risk_score(breaches):
    if len(breaches) == 0:
        return 10
    elif len(breaches) <= 2:
        return 40
    elif len(breaches) == 3:
        return 60
    else:
        return 85

# -------- ROUTES -------- #
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/check", methods=["POST"])
def check():
    email = request.form.get("email")

    breaches = get_mock_breaches(email)
    risk_score = calculate_risk_score(breaches)

    return jsonify({
        "email": email,
        "breach_count": len(breaches),
        "breaches": breaches,
        "risk_score": risk_score
    })

if __name__ == "__main__":
    app.run(debug=True)