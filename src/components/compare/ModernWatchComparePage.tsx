 "use client"
 
 import React, { useState } from 'react'
 import { useCompare } from '@/hooks/useCompare'
 import { ArrowLeft, X, CheckCircle } from 'lucide-react'
import { ViewToggle } from '@/components/ui/ViewToggle'
 import { useRouter } from 'next/navigation'
 import Image from 'next/image'
import { CompareProduct } from '@/features/compare/compareSlice'
 
 interface AttributeConfig {
   key: string
   label: string
   type: 'currency' | 'text'
   suffix?: string
 }
 
 const ModernWatchComparePage = () => {
   const router = useRouter()
   const { removeProduct, clearAll, getProductsByType, maxProducts } = useCompare()
   const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
 
   const watches = getProductsByType('watch')
 
   if (watches.length === 0) {
     return (
       <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
           <div className="text-center max-w-md mx-auto px-6">
             <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
               <div className="text-4xl">⌚</div>
             </div>
             <h2 className="text-2xl font-bold text-foreground mb-3">
               No Watches Selected
             </h2>
             <p className="text-muted-foreground mb-6">
               Choose watches to compare side by side
             </p>
             <button
               onClick={() => router.push('/watches')}
               className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all"
             >
               Browse Watches
             </button>
           </div>
         </div>
     )
   }
 
   const formatPrice = (price: number | string) => {
     const numPrice = typeof price === 'string' ? parseFloat(price) : price
     return new Intl.NumberFormat('en-US', {
       style: 'currency',
       currency: 'USD',
       minimumFractionDigits: 0,
       maximumFractionDigits: 0
     }).format(numPrice)
   }
 
   const comparisonData: AttributeConfig[] = [
     { key: 'price', label: 'Price', type: 'currency' },
     { key: 'brand', label: 'Brand', type: 'text' },
     { key: 'model', label: 'Model', type: 'text' },
     { key: 'movementType', label: 'Movement', type: 'text' },
     { key: 'caseMaterial', label: 'Case Material', type: 'text' },
     { key: 'dialColor', label: 'Dial Color', type: 'text' },
     { key: 'gender', label: 'Gender', type: 'text' },
     { key: 'modelYear', label: 'Year', type: 'text' },
   ]
 
   const formatValue = (value: unknown, type: string, suffix?: string): string => {
     if (value === null || value === undefined || value === '') return '—'
     switch (type) {
       case 'currency':
         return formatPrice(typeof value === 'string' || typeof value === 'number' ? value : 0)
       default:
         return `${String(value)}${suffix || ''}`
     }
   }
 
   return (
     <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
         <div className="bg-card border-b border-border">
           <div className="max-w-7xl mx-auto px-4 py-6">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                >
                   <ArrowLeft className="w-5 h-5" />
                 </button>
                 <div>
                   <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                     Compare Watches
                   </h1>
                   <p className="text-muted-foreground">
                     Comparing {watches.length} of {maxProducts} possible watches
                   </p>
                 </div>
               </div>
 
               <ViewToggle value={viewMode} onChange={setViewMode} />
             </div>
           </div>
         </div>
 
         <div className="max-w-7xl mx-auto px-4 py-6">
          {viewMode === 'grid' ? (
             /* List UI in Grid: vertical table - attributes as rows, products as columns */
             <div className="w-full overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
               <table className="min-w-[600px] w-full border-collapse" style={{ borderColor: 'var(--border)' }}>
                 <thead>
                   <tr style={{ backgroundColor: 'var(--muted)' }}>
                     <th className="text-left p-4 font-semibold w-40 min-w-[160px] sticky left-0 z-10 border-r border-b" style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                       Spec
                     </th>
                     {watches.map((product, index) => {
                       const data = product.data as Record<string, unknown>
                       const title = (data.brand && data.model)
                         ? `${String(data.brand)} ${String(data.model)}`
                         : product.name
                       return (
                         <th key={product.id} className="p-4 min-w-[180px] align-top border-r border-b last:border-r-0" style={{ borderColor: 'var(--border)' }}>
                           <div className="flex flex-col items-center gap-3">
                             <div className="relative">
                               <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                                 <Image
                                   src={product.image}
                                   alt={title}
                                   fill
                                   className="object-cover"
                                 />
                               </div>
                               <span className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--primary)' }}>
                                 {index + 1}
                               </span>
                               <button
                                 onClick={() => removeProduct(product.id)}
                                 className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90 cursor-pointer"
                                 style={{ backgroundColor: 'var(--destructive)' }}
                               >
                                 <X className="w-3 h-3" />
                               </button>
                             </div>
                             <div className="text-center">
                               <div className="font-semibold text-sm line-clamp-2" style={{ color: 'var(--foreground)' }}>{title}</div>
                               <div className="font-bold mt-1" style={{ color: 'var(--status-success)' }}>{formatPrice(product.price)}</div>
                             </div>
                           </div>
                         </th>
                       )
                     })}
                   </tr>
                 </thead>
                 <tbody>
                   {comparisonData.map((attr) => (
                     <tr key={attr.key}>
                       <td className="p-4 font-medium sticky left-0 z-10 border-r border-b" style={{ backgroundColor: 'var(--card)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                         {attr.label}
                       </td>
                       {watches.map((product) => {
                         const data = product.data as Record<string, unknown>
                         const value = data[attr.key]
                         return (
                           <td key={product.id} className="p-4 text-center border-r border-b last:border-r-0" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                             <span className="text-sm font-medium">
                               {formatValue(value, attr.type, attr.suffix)}
                             </span>
                           </td>
                         )
                       })}
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          ) : (
            /* Grid UI in List: horizontal table - products as rows, attributes as columns */
            <div className="w-full overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <table className="min-w-[700px] w-full border-collapse" style={{ borderColor: 'var(--border)' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--muted)' }}>
                    <th className="text-left p-4 font-semibold w-48 min-w-[180px] sticky left-0 z-10 border-r border-b" style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                      Watch
                    </th>
                    {comparisonData.map((attr) => (
                      <th key={attr.key} className="p-4 font-semibold text-center min-w-[100px] border-r border-b" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>{attr.label}</th>
                    ))}
                    <th className="p-4 w-12 border-b" style={{ borderColor: 'var(--border)' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {watches.map((product, index) => {
                    const data = product.data as Record<string, unknown>
                    const title = (data.brand && data.model)
                      ? `${String(data.brand)} ${String(data.model)}`
                      : product.name
                    return (
                      <tr key={product.id}>
                        <td className="p-4 sticky left-0 z-10 border-r border-b" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                              <div className="relative w-14 h-14 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                                <Image src={product.image} alt={title} fill className="object-cover" sizes="56px" />
                              </div>
                              <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--primary)' }}>{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-semibold text-sm line-clamp-2" style={{ color: 'var(--foreground)' }}>{title}</div>
                              <div className="font-bold text-sm mt-0.5" style={{ color: 'var(--status-success)' }}>{formatPrice(product.price)}</div>
                            </div>
                          </div>
                        </td>
                        {comparisonData.map((attr) => {
                          const value = data[attr.key]
                          return (
                            <td key={attr.key} className="p-4 text-center border-r border-b" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                              <span className="text-sm">{formatValue(value, attr.type, attr.suffix)}</span>
                            </td>
                          )
                        })}
                        <td className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                          <button onClick={() => removeProduct(product.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer" style={{ backgroundColor: 'var(--destructive)' }}><X className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
           )}
 
           <div className="mt-6 flex items-center justify-between">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <CheckCircle className="w-4 h-4 text-primary" />
               <span>{watches.length} selected</span>
             </div>
            <button
              onClick={() => clearAll()}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm cursor-pointer"
            >
               Clear All
             </button>
           </div>
         </div>
       </div>
   )
 }
 
 export default ModernWatchComparePage
