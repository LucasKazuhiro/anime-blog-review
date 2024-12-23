from flask import Flask, request, jsonify
import os
import json
import pandas as pd

app = Flask(__name__)

@app.route("/reviews")
def get_anime_reviews():
  reviews_path = "./data/reviews_json"    # Path to review's json files
  reviews_data = []

  # For loop to iterate over the files in a folder
  for file_name in os.listdir(reviews_path):
    # Filter for JSON files
    if(file_name.endswith('.json')):
      review_path = os.path.join(reviews_path, file_name)
      with open(review_path, 'r', encoding='utf-8') as json_file:
        review_dict = json.load(json_file)  # Load json as a dict
        reviews_data.append(review_dict)    # Saves it in the dict array

  reviews_dataframe = pd.DataFrame(reviews_data) # Convert dict array into pandas dataframe

  # Converts date value to datetime type
  reviews_dataframe['reviewDate'] = pd.to_datetime(reviews_dataframe['reviewDate'])
  reviews_dataframe['startDate'] = pd.to_datetime(reviews_dataframe['startDate'])
  reviews_dataframe['endDate'] = pd.to_datetime(reviews_dataframe['endDate'])

  reviews_df_sorted = reviews_dataframe.sort_values(by='reviewDate', ascending=False) # Orders from most recent to least
  reviews_json = reviews_df_sorted.to_dict(orient='records') # Convert the sorted DataFrame to a JSON-like structure

  return reviews_json



@app.route("/review/<id_anime_name>", methods=["POST"])
def search_anime_review(id_anime_name):
  reviews_json = request.get_json()    # Receives the request body (JSON)
  review_target = None

  # Iterate through the reviews
  for review_info in reviews_json:
    # Checks if the id matches the id in the URL
    if(review_info.get("id") == id_anime_name):
      review_target = review_info   # Saves the matching review
      break

  if review_target:
    return jsonify(review_target)   # Returns the matching review as JSON
  else:
    return jsonify({"message": "Review not found"}), 404