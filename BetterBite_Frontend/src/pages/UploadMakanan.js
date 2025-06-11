import React, { useState } from "react";
import "../CSS/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BiCamera } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function UploadMakanan() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("foodPhotoInput").click();
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Mohon pilih foto makanan terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/predict", {  // PORT DIUBAH DISINI
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Respons dari server:", data);
      navigate("/detailMakanan", { state: { foodData: data } });

    } catch (error) {
      console.error("Terjadi kesalahan saat mengupload gambar:", error);
      alert("Gagal mengupload gambar. Silakan coba lagi.");
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="main-container">
      <div className="form-container upload-form-container">
        <h2 className="form-title">Upload Foto Makanan Anda</h2>

        <div
          className={`photo-upload-box ${previewUrl ? "has-image" : ""}`}
          onClick={handleUploadClick}
          role="button"
          tabIndex={0}
          aria-label="Pilih foto makanan"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview Foto Makanan"
              className="uploaded-image-preview"
            />
          ) : (
            <div className="placeholder-icon">
              <BiCamera style={{ fontSize: "4rem", color: "#888" }} />
            </div>
          )}
          <input
            type="file"
            id="foodPhotoInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        <div className="upload-buttons-container">
          <button className="btn submit-btn-kirim" onClick={handleSubmit}>
            Kirim
          </button>
          <button
            className="btn btn-danger upload-batal-btn"
            onClick={handleCancel}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
