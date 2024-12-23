from flask import Flask
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