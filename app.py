import os
import unittest
import requests

from flask import Flask, jsonify
from flask_cors import CORS

# configuration
DEBUG = True

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)
# enable CORS
CORS(app)
# sanity check route
@app.route('/index', methods=['GET'])
def main():
    return jsonify('Hello World')
# chauhiulaam comments
# 2019 new year
"""
@app.route('/join', methods=['POST'])
@app.route('/leave', methods=['POST'])
"""
@app.route('/players', methods= ['GET'])
def players():
    with open('data.txt') as f:
        lines = f.read().splitlines()
        return str(len(lines))
if __name__ == "__main__":
    app.run(debug=True)