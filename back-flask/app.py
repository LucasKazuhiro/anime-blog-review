from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:4200", "https://korosenku.vercel.app"]}})

@app.route("/reviews")
def get_anime_reviews():
  reviews_path = "./data/reviews_json"    # Path to review's json files
  reviews_data = []

  # For loop to iterate over the files in a folder
  for file_name in os.listdir(reviews_path):
    # Filter for JSON files
    if file_name.endswith('.json'):
      review_path = os.path.join(reviews_path, file_name)
      with open(review_path, 'r', encoding='utf-8') as json_file:
        review_dict = json.load(json_file)  # Load json as a dict
        reviews_data.append(review_dict)    # Saves it in the dict array

  # Return a message if no reviews are found
  if not reviews_data:
    return jsonify({"message": "No reviews found"}), 404

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
    if review_info.get("id") == id_anime_name:
      review_target = review_info   # Saves the matching review
      break

  if review_target:
    return jsonify(review_target)   # Returns the matching review as JSON
  else:
    return jsonify({"message": "Review not found"}), 404



@app.route("/musics/<music_type>")
def get_anime_musics(music_type):
  musics_path = f"./data/musics_json/{music_type}"  # Path to specific music type json files
  musics_data = []

  # Check if directory exists
  if not os.path.exists(musics_path):
    return jsonify({"message": f"No data found for music type: {musics_path}"}), 404

  # For loop to iterate over the files in a folder
  for file_name in os.listdir(musics_path):
    # Filter for JSON files
    if file_name.endswith('.json'):
      music_path = os.path.join(musics_path, file_name)
      with open(music_path, 'r', encoding='utf-8') as json_file:
        music_dict = json.load(json_file)  # Load json as a dict
        musics_data.append(music_dict)  # Saves it in the dict array

  # Return a message if no musics are found
  if not musics_data:
    return jsonify({"message": "No musics found"}), 404

  musics_dataframe = pd.DataFrame(musics_data)  # Convert dict array into pandas dataframe
  musics_dataframe['addedDate'] = pd.to_datetime(musics_dataframe['addedDate']) # Converts date value to datetime type

  musics_df_sorted = musics_dataframe.sort_values(by='addedDate', ascending=False)  # Orders from most recent to least
  musics_json = musics_df_sorted.to_dict(orient='records')  # Convert the sorted DataFrame to a JSON-like structure

  return musics_json



@app.route("/favorites/<fav_type>")
def get_favorites(fav_type):
  fav_file = f"./data/favorites_json/{fav_type}.json"  # Path to specific fav type json file

  # Check if fav type json file exists
  if not os.path.exists(fav_file):
    return jsonify({"message": f"No data found for favorite type: {fav_type}"}), 404

  with open(fav_file, 'r', encoding='utf-8') as json_file:
    fav_dict = json.load(json_file)  # Load json as a dict

  # Return a message if no favorites are found
  if not fav_dict:
    return jsonify({"message": f"No favorites {fav_type} found"}), 404

  return fav_dict