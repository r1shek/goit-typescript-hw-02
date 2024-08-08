import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ImageGallery from '../ImageGallery/ImageGallery';
import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import ImageModal from '../ImageModal/ImageModal';
import css from './App.module.css';

const ACCESS_KEY = 'uEzN53ptLdD6dnTb3C04fRkAZbqF0caImWWRbsjGkFo';

export default function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const fetchImages = async (searchQuery, pageNumber) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: {
            query: searchQuery,
            page: pageNumber,
            per_page: 12,
            client_id: ACCESS_KEY,
          },
        }
      );
      const results = response.data.results;
      if (results.length === 0 && pageNumber === 1) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
      setImages((prevImages) =>
        pageNumber === 1 ? results : [...prevImages, ...results]
      );
      setPage(pageNumber);
      setTotalResults(response.data.total);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      if (err.response && err.response.status === 403) {
        toast.error(
          'Access forbidden: Please check your API key or rate limits.'
        );
      } else {
        toast.error('An error occurred while fetching images.');
      }
    }
  };

  const handleSearchSubmit = (searchQuery) => {
    setQuery(searchQuery);
    setImages([]);
    setPage(1);
    setNoResults(false);
    fetchImages(searchQuery, 1);
  };

  const handleLoadMore = () => {
    fetchImages(query, page + 1);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const shouldShowLoadMore =
    images.length > 0 && images.length < totalResults && !loading;

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearchSubmit} />
      {error && <ErrorMessage message={error} />}
      {noResults && <ErrorMessage message="No results found" />}
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {loading && <Loader />}
      {shouldShowLoadMore && <LoadMoreBtn onClick={handleLoadMore} />}
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={closeModal} />
      )}
    </div>
  );
}
