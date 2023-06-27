import React, { Component } from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { Overlay, ModalWindow } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ onClose, children }) {
  // static propTypes = {
  //   children: PropTypes.node.isRequired,
  //   onClose: PropTypes.func.isRequired,
  // };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return createPortal(
    <Overlay onClick={handleBackdropClick}>
      <ModalWindow>{children} </ModalWindow>
    </Overlay>,
    modalRoot
  );
}

// export default class Modal extends Component {
//   static propTypes = {
//     children: PropTypes.node.isRequired,
//     onClose: PropTypes.func.isRequired,
//   };

//   componentDidMount() {
//     window.addEventListener('keydown', this.handleKeyDown);
//   }

//   componentWillUnmount() {
//     window.removeEventListener('keydown', this.handleKeyDown);
//   }

//   handleKeyDown = e => {
//     if (e.code === 'Escape') {
//       this.props.onClose();
//     }
//   };

//   handleBackdropClick = event => {
//     if (event.currentTarget === event.target) {
//       this.props.onClose();
//     }
//   };

//   render() {
//     return createPortal(
//       <Overlay onClick={this.handleBackdropClick}>
//         <ModalWindow>{this.props.children} </ModalWindow>
//       </Overlay>,
//       modalRoot
//     );
//   }
// }
