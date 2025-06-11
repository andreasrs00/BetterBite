from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
import json
import requests

# Paksa penggunaan CPU saja (disable GPU)
os.environ["CUDA_VISIBLE_DEVICES"] = ""

# Inisialisasi Flask
app = Flask(__name__)
CORS(app)

# Konfigurasi folder upload
app.config['UPLOAD_FOLDER'] = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# ID file Google Drive dan nama file model
MODEL_FILE_ID = "1lhBAXGdYDAB3LIwc6-WiyjKnq61ghOCT"
MODEL_FILENAME = "food101_mobilenetv2_final.keras"

# Download model dari Google Drive jika belum ada
def download_model_from_gdrive(file_id, destination):
    print("Downloading model from Google Drive...")
    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(destination, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
    print("Model downloaded successfully.")

# Load model
try:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, MODEL_FILENAME)

    if not os.path.exists(model_path):
        download_model_from_gdrive(MODEL_FILE_ID, model_path)

    model = tf.keras.models.load_model(model_path, compile=False)
except Exception as e:
    raise RuntimeError(f"Failed to load model: {e}")

# Daftar nama kelas
class_names = [
    'apple_pie', 'baby_back_ribs', 'baklava', 'beef_carpaccio', 'beef_tartare', 'beet_salad', 'beignets',
    'bibimbap', 'bread_pudding', 'breakfast_burrito', 'caesar_salad', 'cannoli', 'caprese_salad', 'carrot_cake',
    'cheese_plate', 'cheesecake', 'chicken_quesadilla', 'chicken_wings', 'chocolate_cake', 'chocolate_mousse',
    'churros', 'clam_chowder', 'club_sandwich', 'crab_cakes', 'creme_brulee', 'croque_madame', 'cup_cakes',
    'deviled_eggs', 'donuts', 'dumplings', 'edamame', 'eggs_benedict', 'escargots', 'falafel', 'filet_mignon',
    'foie_gras', 'french_fries', 'french_toast', 'fried_calamari', 'fried_rice', 'frozen_yogurt', 'garlic_bread',
    'grilled_cheese_sandwich', 'grilled_salmon', 'guacamole', 'gyoza', 'hamburger', 'hot_dog', 'huevos_rancheros',
    'hummus', 'ice_cream', 'lasagna', 'lobster_bisque', 'lobster_roll_sandwich', 'macarons', 'miso_soup', 'mussels',
    'nachos', 'omelette', 'onion_rings', 'oysters', 'pad_thai', 'paella', 'pancakes', 'panna_cotta', 'peking_duck',
    'pho', 'pizza', 'pork_chop', 'poutine', 'prime_rib', 'pulled_pork_sandwich', 'ramen', 'red_velvet_cake',
    'risotto', 'samosa', 'sashimi', 'seaweed_salad', 'spaghetti_bolognese', 'spaghetti_carbonara', 'spring_rolls',
    'steak', 'strawberry_shortcake', 'sushi', 'tacos', 'takoyaki', 'tiramisu', 'tuna_tartare', 'waffles'
]

# Validasi ekstensi file
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Prediksi gambar
def predict_image(image_path):
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    with tf.device('/CPU:0'):  # Paksa prediksi di CPU
        predictions = model.predict(img_array)

    predicted_index = np.argmax(predictions)
    predicted_class = class_names[predicted_index]
    confidence = float(predictions[0][predicted_index])

    return predicted_class, confidence

# Ambil data nutrisi
def get_nutrition_data(food_snake_case):
    food_title_case = food_snake_case.replace('_', ' ').title()
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join(base_dir, './Apps/FoodNutrition.json')
        with open(json_path, 'r') as f:
            nutrition_data = json.load(f)
    except FileNotFoundError:
        return None

    for item in nutrition_data:
        if item['food_name'].lower() == food_title_case.lower():
            return item

    return None

# Endpoint prediksi
@app.route('/predict', methods=['POST'])
def predict_food_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No file uploaded!'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    file.save(filepath)

    label_snake, confidence = predict_image(filepath)
    label_title = label_snake.replace('_', ' ').title()

    nutrition = get_nutrition_data(label_snake)

    if nutrition:
        return jsonify({
            'food_name': label_title,
            'confidence': confidence,
            'image_url': f'/static/uploads/{filename}',
            'nutrition_info': {
                'calories': nutrition.get('calories'),
                'total_fat': nutrition.get('fat'),
                'protein': nutrition.get('protein'),
                'carbohydrate': nutrition.get('carbohydrate'),
                'cholesterol': nutrition.get('cholesterol'),
                'calcium': nutrition.get('calcium', 0.0),
                'fiber': nutrition.get('fiber'),
                'iron': nutrition.get('iron'),
                'sugar': nutrition.get('sugar')
            }
        }), 200
    else:
        return jsonify({
            'food_name': label_title,
            'confidence': confidence,
            'image_url': f'/static/uploads/{filename}',
            'nutrition_info': 'Not found'
        }), 200

# Jalankan server
if __name__ == '__main__':
    app.run(debug=True, port=8000)
