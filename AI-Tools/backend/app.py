import pandas as pd
from sklearn.model_selection import train_test_split
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.applications import MobileNet
from tensorflow.keras.applications.mobilenet import preprocess_input, decode_predictions
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from transformers import pipeline
from textblob import TextBlob

# Initialize Flask app
app = Flask(__name__)
CORS(app) 

# --------- Initialize prediction models ---------

# Image classification model (MobileNet)
image_model = MobileNet(weights="imagenet")

# Article classification model
text_data = fetch_20newsgroups(
    subset='all',
    categories=['sci.space', 'rec.sport.baseball', 'talk.politics.mideast', 'comp.graphics']
)
text_model = make_pipeline(TfidfVectorizer(), MultinomialNB())
X_train, X_test, y_train, y_test = train_test_split(text_data.data, text_data.target, test_size=0.25, random_state=42)
text_model.fit(X_train, y_train)
target_names = text_data.target_names
category_mapping = {
    'sci.space': 'Science - Space',
    'rec.sport.baseball': 'Recreational Sports - Baseball',
    'talk.politics.mideast': 'Politics - Middle East',
    'comp.graphics': 'Computer Science - Graphics'
}

# Sentiment analysis model
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# --------- Define API endpoints ---------

# Endpoint for image classification using MobileNet
@app.route('/classify_image', methods=['POST'])
def classify_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    image = Image.open(image_file)
    image = image.resize((224, 224))
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    image = preprocess_input(image)

    predictions = image_model.predict(image)
    results = decode_predictions(predictions, top=3)[0]
    output = [{"label": label, "description": description, "probability": float(probability)}
              for (label, description, probability) in results]
    return jsonify(output)

# Endpoint for Article classification
@app.route('/predict', methods=['POST'])
def predict_text():
    data = request.json
    texts = data.get('texts', [])

    predictions = text_model.predict(texts)
    categories = [category_mapping[target_names[pred]] for pred in predictions]
    return jsonify({"texts": texts, "predicted_categories": categories})

# Endpoint for sentiment analysis
@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    data = request.json
    text = data.get('text', '')

    result = sentiment_analyzer(text)[0]
    sentiment = result['label']
    polarity_score = result['score']
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    # Determine sentiment based on polarity
    if polarity > 0:
        sentiment = "Positive"
    elif polarity < 0:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    # Adjust polarity score if sentiment analysis confidence is low
    if sentiment == "Positive" and polarity_score < 0.5:
        polarity = polarity_score 
    elif sentiment == "Negative" and polarity_score < 0.5:
        polarity = polarity_score 
    else:
        polarity = round(polarity, 2)

    return jsonify({'sentiment': sentiment, 'polarity': polarity})

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
