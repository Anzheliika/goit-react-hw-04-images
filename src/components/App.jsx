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
  const [requestPicture, setRequestPicture] = useState('');
  const [pictureData, setPictureData] = useState('');
  const [largeImage, setLargeImage] = useState('');
  const [status, setStatus] = useState('idle');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

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

        const dataLength = res.data.hits.length;

        setIsLoadingMore(prevState =>
          prevState.length + dataLength === res.data.totalHits ? false : true
        );

        if (dataLength === 0) {
          toast.error('There is no picture for that name');
        }
      })
      .catch(error => console.log(error));
  }, [requestPicture, page]);

  // componentDidUpdate(prevState, prevProps) {
  //   const prevSearch = prevProps.requestPicture;
  //   const nextSearch = this.state.requestPicture;
  //   const prevPage = prevProps.page;
  //   const nextPage = this.state.page;

  //   if (prevSearch !== nextSearch) {
  //     this.loadPicture();
  //     this.resetData();
  //   }

  //   if (nextPage > prevPage) {
  //     this.loadPicture();
  //   }
  // }

  const handleFormSubmit = requestPicture => {
    setPage(1);
    setRequestPicture(requestPicture);
    setPictureData('');
    setIsLoadingMore(false);
  };

  const loadMore = () => {
    setPage(prevState => prevState.page + 1);
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

// export default class App extends React.Component {
//   state = {
//     requestPicture: '',
//     pictureData: '',
//     largeImage: '',
//     status: 'idle',
//     IsLoadingMore: false,
//     page: 1,
//   };

//   componentDidUpdate(prevState, prevProps) {
//     const prevSearch = prevProps.requestPicture;
//     const nextSearch = this.state.requestPicture;
//     const prevPage = prevProps.page;
//     const nextPage = this.state.page;

//     if (prevSearch !== nextSearch) {
//       this.loadPicture();
//       this.resetData();
//     }

//     if (nextPage > prevPage) {
//       this.loadPicture();
//     }
//   }

//   loadPicture = () => {
//     const { requestPicture, page } = this.state;

//     this.setState({ status: 'pending' });

//     api
//       .fetchPicture(requestPicture, page)
//       .then(res => {
//         const data = res.data.hits.map(
//           ({ id, webformatURL, largeImageURL }) => ({
//             id,
//             webformatURL,
//             largeImageURL,
//           })
//         );

//         const dataLength = res.data.hits.length;

//         this.setState(prevState => ({
//           pictureData: [...prevState.pictureData, ...data],
//           status: 'resolved',
//           IsLoadingMore:
//             prevState.pictureData.length + dataLength === res.data.totalHits
//               ? false
//               : true,
//         }));
//         if (dataLength === 0) {
//           toast.error('There is no picture for that name');
//         }
//       })
//       .catch(error => console.log(error));
//   };

//   handleFormSubmit = requestPicture => {
//     this.resetPage();
//     this.setState({ requestPicture });
//   };

//   loadMore = () => {
//     this.setState(prevState => ({
//       page: prevState.page + 1,
//     }));
//   };

//   pictureModalClick = picture => {
//     this.setState({
//       largeImage: picture,
//     });
//   };

//   closeModal = () => {
//     this.setState({
//       largeImage: '',
//     });
//   };

//   resetPage() {
//     this.setState({
//       page: 1,
//     });
//   }

//   resetData() {
//     this.setState({
//       pictureData: '',
//       IsLoadingMore: false,
//     });
//   }

//   render() {
//     const { status, pictureData, largeImage, IsLoadingMore } = this.state;

//     return (
//       <div>
//         <Searchbar onSubmit={this.handleFormSubmit} />
//         {pictureData.length > 0 && (
//           <ImageGallery
//             pictureData={pictureData}
//             onClick={this.pictureModalClick}
//           ></ImageGallery>
//         )}
//         {status === 'pending' && <LoaderSpiner />}

//         {IsLoadingMore && <LoadMore onClick={this.loadMore} />}

//         {largeImage.length > 0 && (
//           <Modal onClose={this.closeModal}>
//             <img src={largeImage} alt="" />
//           </Modal>
//         )}
//       </div>
//     );
//   }
// }
