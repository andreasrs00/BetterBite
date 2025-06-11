# Gunakan image Python
FROM python:3.10-slim

# Set workdir
WORKDIR /app

# Copy semua file
COPY . .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose port
EXPOSE 8000

# Jalankan aplikasi dengan gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "app:app"]