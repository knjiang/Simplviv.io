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

# 2019 new year
if __name__ == '__main__':
    app.run()