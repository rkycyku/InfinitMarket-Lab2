import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownAZ, faArrowUpZA, faArrowDownShortWide, faArrowUpWideShort, faArrowsUpDown, faArrowDown19, faArrowUp91 } from '@fortawesome/free-solid-svg-icons';

const SortIcon = ({ configKey, type, direction }) => {
  const getIcon = () => {
    switch (type) {
      case 'text':
        return direction === 'ascending' ? <FontAwesomeIcon icon={faArrowDownAZ} /> : <FontAwesomeIcon icon={faArrowUpZA} />;
      case 'number':
        return direction === 'ascending' ? <FontAwesomeIcon icon={faArrowDown19} /> : <FontAwesomeIcon icon={faArrowUp91} />;
      case 'date':
        return direction === 'ascending' ? <FontAwesomeIcon icon={faArrowDownShortWide} /> : <FontAwesomeIcon icon={faArrowUpWideShort} />;
      default:
        return <FontAwesomeIcon icon={faArrowsUpDown} />;
    }
  };

  return getIcon();
};

export default SortIcon;
