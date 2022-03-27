import Image from 'next/image'
import Link from 'next/link'
import { currencyFormatter } from '../utils/helper'

const ProductCard = ({ product }) => {
  const { handle, title } = product.node
  const { originalSrc } = product.node.images.edges[0].node
  const price = currencyFormatter(product.node.priceRange.minVariantPrice.amount);
  return (
    <Link href={`/products/${handle}`}>
      <a className="group">
        <div className="w-full overflow-hidden rounded-3xl bg-gray-200">
          <div className="relative h-80 group-hover:opacity-75">
            <Image
              src={originalSrc}
              layout={'fill'}
              objectFit={'cover'}
            ></Image>
          </div>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
        <p className='mt-1 text-sm text-gray-900'>{price}</p>
      </a>
    </Link>
  )
}

export default ProductCard
