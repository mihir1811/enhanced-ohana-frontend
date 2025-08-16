import ProductResultsPage from '@/components/products/ProductResultsPage'

export default function GemstoneResults({ params }: { params: { category: string } }) {
  return (
    <ProductResultsPage 
      params={{ 
        product: 'gemstones', 
        category: params.category 
      }} 
    />
  )
}
