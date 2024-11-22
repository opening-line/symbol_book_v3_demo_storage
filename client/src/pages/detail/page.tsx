import { useParams } from "react-router-dom"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import useGetImageFromBlockchain from "../../hooks/useGetImageFromBlockchain.ts"
import Container from "../../components/Container.tsx";
import Button from "../../components/Button.tsx";

const Detail = () => {
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useGetImageFromBlockchain(id)

  return (
    <Container>
      <h1 className='text-2xl font-bold mb-8'>画像詳細</h1>

      <p className='mb-2'>
        <span className='text-lg mr-2'>ファイルID:</span>
        <span className='text-xl font-bold'>{id}</span>
      </p>

      <p className='mb-2'>
        <span className='text-lg mr-2'>ファイル名:</span>
        <span className='text-xl font-bold'>
          {data && data.meta && data.meta.fileName ? (
            <span>{data.meta.fileName}</span>
          ) : (
            <span>不明</span>
          )}
        </span>
      </p>

      <p className='mb-2'>
        <span className='text-lg mr-2'>アップロード日付:</span>
        <span className='text-xl font-bold'>
          {data && data.meta && data.meta.timestamp ? (
            <span>{`${new Date(data.meta.timestamp).toLocaleString()}`}</span>
          ) : (
            <span>不明</span>
          )}
        </span>
      </p>

      <div className='mb-4 h-96 w-full'>
        {loading ? (
          <div className='flex items-center justify-start'>
            Loading
            <EllipsisHorizontalIcon className='w-5 h-5'/>
          </div>
        ) : error ? (
          <div>Error loading image</div>
        ) : (
          <div className='inline-block h-full p-4 shadow-lg'>
            {data && data.payload && data.mime ? (
              <img
                src={`data:${data.mime};base64,${data.payload}`}
                className='h-full object-contain'
                alt='Preview'
              />
            ) : (
              <img
                src='/no_image.svg'
                className='w-full h-full object-contain'
                alt='Preview'
              />
            )}
          </div>
        )}
      </div>
      <div>
        <Button
          onClick={() => window.history.back()}
        >
          戻る
        </Button>
      </div>
    </Container>
  )
}

export default Detail
