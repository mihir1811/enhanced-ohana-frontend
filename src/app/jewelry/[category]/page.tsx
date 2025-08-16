import ProductResultsPage from '@/components/products/ProductResultsPage'

export default function JewelryResults({ params }: { params: { category: string } }) {
  return (
    <ProductResultsPage 
      params={{ 
        product: 'jewelry', 
        category: params.category 
      }} 
    />
  )
}
