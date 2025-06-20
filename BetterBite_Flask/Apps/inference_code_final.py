# -*- coding: utf-8 -*-
"""Untitled51.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1YeOtcmuDduYY-zLi_33iWdJfFRXvpJoe
"""

import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

model = tf.keras.models.load_model('food101_mobilenetv2_final.h5')

class_names = [
    'apple_pie', 'baby_back_ribs', 'baklava', 'beef_carpaccio', 'beef_tartare', 'beet_salad', 'beignets',
    'bibimbap', 'bread_pudding', 'breakfast_burrito', 'caesar_salad', 'cannoli', 'caprese_salad', 'carrot_cake',
    'cheese_plate', 'cheesecake', 'chicken_quesadilla', 'chicken_wings', 'chocolate_cake', 'chocolate_mousse',
    'churros', 'clam_chowder', 'club_sandwich', 'crab_cakes', 'creme_brulee', 'croque_madame', 'cup_cakes',
    'deviled_eggs', 'donuts', 'dumplings', 'edamame', 'eggs_benedict', 'escargots', 'falafel', 'filet_mignon',
    'foie_gras', 'french_fries', 'french_toast', 'fried_calamari', 'fried_rice', 'frozen_yogurt', 'garlic_bread',
    'grilled_cheese_sandwich', 'grilled_salmon', 'guacamole', 'gyoza', 'hamburger', 'hot_and_sour_soup', 'hot_dog',
    'huevos_rancheros', 'hummus', 'ice_cream', 'lasagna', 'lobster_bisque', 'lobster_roll_sandwich', 'macarons',
    'miso_soup', 'mussels', 'nachos', 'omelette', 'onion_rings', 'oysters', 'pad_thai', 'paella', 'pancakes',
    'panna_cotta', 'peking_duck', 'pho', 'pizza', 'pork_chop', 'poutine', 'prime_rib', 'pulled_pork_sandwich',
    'ramen', 'red_velvet_cake', 'risotto', 'samosa', 'sashimi', 'seaweed_salad', 'spaghetti_bolognese',
    'spaghetti_carbonara', 'spring_rolls', 'steak', 'strawberry_shortcake', 'sushi', 'tacos', 'takoyaki',
    'tiramisu', 'tuna_tartare', 'waffles'
]

def predict_image(image_path):
    """
    Memprediksi jenis makanan dari gambar menggunakan model Food101.
    :param image_path: Path ke file gambar.
    """
    # Load dan preprocess gambar
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = img_array / 255.0  # Normalisasi
    img_array = np.expand_dims(img_array, axis=0)  # Tambahkan batch dimension

    # Prediksi
    predictions = model.predict(img_array)
    predicted_index = np.argmax(predictions)
    predicted_class = class_names[predicted_index]
    confidence = predictions[0][predicted_index]

    print(f"Prediksi: {predicted_class.replace('_', ' ').title()} (Confidence: {confidence:.2f})")

if __name__ == "__main__":
    predict_image('eskrim.jpeg')  # Ganti dengan path gambar yang diinginkan