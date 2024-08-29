import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowForward, IoMdHome } from 'react-icons/io';

const CustomBreadcrumbs = ({ data }) => {
  return (
    <nav className="flex flex-wrap items-center gap-2 pb-2 mb-2 font-medium text-primary-400 ">
    <IoMdHome />
      {data.map((item, index) => (
        <span key={index}  >
          {index > 0 &&  <span className='mr-1' > / </span> }
          {item.url ? (
            <Link to={item.url} className="hover:underline">
              {item.title}
            </Link>
          ) : (
            <span>{item.title}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default CustomBreadcrumbs;
