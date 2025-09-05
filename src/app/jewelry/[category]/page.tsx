import ProductResultsPage from '@/components/products/ProductResultsPage'

export default async function JewelryResults({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  
  return (
    <ProductResultsPage 
      params={{ 
        product: 'jewelry', 
        category: resolvedParams.category 
      }} 
    />
  )
}
