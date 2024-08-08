import React from 'react';
import Modal from 'react-modal';
import css from './ImageModal.module.css';

Modal.setAppElement('#root');

export default function ImageModal({ image, onClose }) {
  const { urls, user, likes, description } = image;

  return (
    <Modal isOpen={true} onRequestClose={onClose}>
      <div className={css.modalContent} onClick={onClose}>
        <img src={urls.regular} alt={description} />
        <div>
          <p>By: {user.name}</p>
          <p>Likes: {likes}</p>
          {description && <p>Description: {description}</p>}
        </div>
        <button className={css.closeBtn} onClick={onClose}>
          &times;
        </button>
      </div>
    </Modal>
  );
}
