import React, { useEffect, useState } from 'react';

import ReactPaginate from 'react-paginate';
import Styles from "./DataTable.module.css";
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi';
import { Box } from '@chakra-ui/react';

function PaginatedItems({ itemsPerPage, totalPage, setCurrentPage, currentPage }: any) {
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  // const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  // const endOffset = itemOffset + itemsPerPage;
  // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  // const currentItems = items.slice(itemOffset, endOffset);
  // const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {

    setCurrentPage(event.selected + 1);
  };

  return (
    <Box>
      <ReactPaginate
        breakLabel="..."
        nextLabel={
          <Box
            bg={'#F2F2F8'}
            p='6px'
            borderRadius={'6px'}
          >
            <BiSolidRightArrow color='#003D86' />
          </Box>}
        onPageChange={handlePageClick}
        forcePage={parseInt(currentPage) - 1}
        containerClassName={Styles.pagination}
        previousLinkClassName={Styles.paginationLink}
        nextLinkClassName={Styles.paginationLink}
        disabledClassName={Styles.paginationDisabled}
        activeClassName={Styles.paginationActive}
        pageRangeDisplayed={1}
        pageCount={totalPage}
        previousLabel={
          <Box
            bg={'#F2F2F8'}
            p='6px'
            borderRadius={'6px'}
          >
            <BiSolidLeftArrow color='#003D86' />
          </Box>
        }
        renderOnZeroPageCount={null}
      />
    </Box>
  );
}

export default PaginatedItems;