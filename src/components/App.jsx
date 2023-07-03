import React from 'react';
import { useState, useEffect } from 'react';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Searchbar from 'components/Searchbar/Searchbar';
import Modal from 'components/Modal/Modal';
import LoadMore from 'components/Button/Button';
import LoaderSpiner from 'components/Loader/Loader';
import toast from 'react-hot-toast';
import api from 'services/picture-api';

export default function App() {
  const [{ requestPicture }, setRequestPicture] = useState('');
  const [pictureData, setPictureData] = useState('');
  const [largeImage, setLargeImage] = useState('');
  const [status, setStatus] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState('');

  useEffect(() => {
    if (!requestPicture) {
      return;
    }

    setStatus('pending');

    api
      .fetchPicture(requestPicture, page)
      .then(res => {
        const data = res.data.hits.map(
          ({ id, webformatURL, largeImageURL }) => ({
            id,
            webformatURL,
            largeImageURL,
          })
        );

        setPictureData(prevState => [...prevState, ...data]);
        setStatus('resolved');

        const lengthData = (page - 1) * 12 + res.data.hits.length;

        if (lengthData >= res.data.totalHits) {
          setIsLoadingMore(false);
        } else {
          setIsLoadingMore(true);
        }

        // setIsLoadingMore(prevState =>
        //   prevState.length + lengthData === res.data.totalHits ? false : true
        // );

        if (res.data.hits.length === 0) {
          toast.error('There is no picture for that name');
          setStatus(null);
          setIsLoadingMore(false);
          return;
        }
      })
      .catch(error => console.log(error));
  }, [requestPicture, page]);

  const handleFormSubmit = requestPicture => {
    setPage(1);
    setRequestPicture({requestPicture});
    setPictureData('');
    setIsLoadingMore(false);
  };

  const loadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const pictureModalClick = picture => {
    setLargeImage(picture);
  };

  const closeModal = () => {
    setLargeImage('');
  };

  return (
    <div>
      <Searchbar onSubmit={handleFormSubmit} />
      {pictureData.length > 0 && (
        <ImageGallery
          pictureData={pictureData}
          onClick={pictureModalClick}
        ></ImageGallery>
      )}
      {status === 'pending' && <LoaderSpiner />}

      {isLoadingMore && <LoadMore onClick={loadMore} />}

      {largeImage.length > 0 && (
        <Modal onClose={closeModal}>
          <img src={largeImage} alt="" />
        </Modal>
      )}
    </div>
  );
}
