import React from 'react';
import useGetImageFromBlockchain from "../hooks/useGetImageFromBlockchain.ts"

type ImageDisplayProps = {
  fileId: number | string;
};

const ImageListItem: React.FC<ImageDisplayProps> = ({ fileId }) => {

  const { data, loading, error } = useGetImageFromBlockchain(fileId.toString())

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading image</p>
      ) : (
        <>
          {data?.payload && (
            <img src={`data:image/png;base64,${data?.payload}`} alt='Preview' />
          )}
        </>
      )}
    </div>
  );
};

export default ImageListItem;
