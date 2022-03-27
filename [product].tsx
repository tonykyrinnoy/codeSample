import React from 'react'
import { ProductPageContent } from '../../components/ProductPageContent'
import { getAllProducts } from '../../lib/getAllProductsQuery'
import { getProductByHandle } from '../../lib/getProductByHandle'

const ProductPage = ({ product }) => {
  return <ProductPageContent product={product}></ProductPageContent>
}
export default ProductPage

export async function getStaticPaths() {
  const data = await getAllProducts()
  const paths = data.map(({ node: { handle } }) => {
    return {
      params: { product: handle },
    }
  })
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  console.log(params)
  const product = await getProductByHandle(params.product)
  return {
    props: {
      product,
    },
  }
}
