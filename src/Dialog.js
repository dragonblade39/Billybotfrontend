import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ErrorModal({ error, errorMessage, onHide, ...props }) {
  const modalStyles = {
    modalContent: {
      background: "white",
      borderRadius: "10px",
      padding: "20px",
      maxWidth: "500px",
      width: "100%",
      textAlign: "center",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      color: "black", // Ensures text color is black
    },
    modalBody: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      backgroundColor: "transparent",
      border: "none",
      fontSize: "20px",
      cursor: "pointer",
    },
    modalFooterButton: {
      backgroundColor: "black",
      border: "none",
      color: "white",
      padding: "8px 16px",
      fontSize: "16px",
      borderRadius: "5px",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <Modal
      {...props}
      show={props.show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
    >
      <div style={modalStyles.modalContent}>
        <button
          style={modalStyles.closeButton}
          onClick={onHide}
          aria-label="Close"
        >
          &times;
        </button>
        <div style={modalStyles.modalBody}>
          <h2>{error}</h2>
          <p>{errorMessage}</p>
        </div>
        <Button onClick={onHide} style={modalStyles.modalFooterButton}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

export default ErrorModal;
