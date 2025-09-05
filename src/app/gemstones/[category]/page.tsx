import ProductResultsPage from '@/components/products/ProductResultsPage'

export default async function GemstoneResults({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  
  return (
    <ProductResultsPage 
      params={{ 
        product: 'gemstones', 
        category: resolvedParams.category 
      }} 
    />
  )
}
