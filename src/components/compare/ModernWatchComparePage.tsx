 "use client"
 
 import React, { useState } from 'react'
 import { useCompare } from '@/hooks/useCompare'
 import { ArrowLeft, X, Grid, List, CheckCircle } from 'lucide-react'
 import { useRouter } from 'next/navigation'
 import Image from 'next/image'
 import Navigation from '@/components/Navigation'
 import Footer from '@/components/Footer'
 import { CompareProduct } from '@/features/compare/compareSlice'
 
 interface AttributeConfig {
   key: string
   label: string
   type: 'currency' | 'text'
   suffix?: string
 }
 
 const ModernWatchComparePage = () => {
   const router = useRouter()
   const { removeProduct, clearAll, getProductsByType } = useCompare()
   const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
 
   const watches = getProductsByType('watch')
 
   if (watches.length === 0) {
     return (
       <>
         <Navigation />
         <div className="min-h-screen bg-background flex items-center justify-center">
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
         <Footer />
       </>
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
     <>
       <Navigation />
       <div className="min-h-screen bg-background">
         <div className="bg-card border-b border-border">
           <div className="max-w-7xl mx-auto px-4 py-6">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <button
                   onClick={() => router.back()}
                   className="p-2 hover:bg-muted rounded-lg transition-colors"
                 >
                   <ArrowLeft className="w-5 h-5" />
                 </button>
                 <div>
                   <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                     Compare Watches
                   </h1>
                   <p className="text-muted-foreground">
                     Comparing {watches.length} of 6 possible watches
                   </p>
                 </div>
               </div>
 
               <div className="hidden sm:flex bg-card rounded-lg p-1 border border-border">
                 <button
                   onClick={() => setViewMode('grid')}
                   className={`p-2 rounded-md transition-colors ${
                     viewMode === 'grid' 
                       ? 'bg-primary text-primary-foreground' 
                       : 'text-foreground hover:bg-muted'
                   }`}
                 >
                   <Grid className="w-4 h-4" />
                 </button>
                 <button
                   onClick={() => setViewMode('table')}
                   className={`p-2 rounded-md transition-colors ${
                     viewMode === 'table' 
                       ? 'bg-primary text-primary-foreground' 
                       : 'text-foreground hover:bg-muted'
                   }`}
                 >
                   <List className="w-4 h-4" />
                 </button>
               </div>
             </div>
           </div>
         </div>
 
         <div className="max-w-7xl mx-auto px-4 py-6">
           {viewMode === 'grid' ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {watches.map((product) => {
                 const data = product.data as Record<string, unknown>
                 const title = (data.brand && data.model)
                   ? `${String(data.brand)} ${String(data.model)}`
                   : product.name
                 return (
                   <div key={product.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                     <div className="relative aspect-[4/5] bg-muted">
                       <Image
                         src={product.image}
                         alt={title}
                         fill
                         className="object-cover"
                       />
                       <button
                         onClick={() => removeProduct(product.id)}
                         className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow"
                       >
                         <X className="w-4 h-4" />
                       </button>
                     </div>
                     <div className="p-4">
                       <h3 className="font-semibold text-foreground line-clamp-2">{title}</h3>
                       <p className="font-bold text-primary mt-1">{formatPrice(product.price)}</p>
                       <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                         {comparisonData.slice(1).map((attr) => {
                           const value = data[attr.key]
                           return (
                             <div key={attr.key} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                               <span className="text-muted-foreground">{attr.label}</span>
                               <span className="font-medium">{formatValue(value, attr.type, attr.suffix)}</span>
                             </div>
                           )
                         })}
                       </div>
                     </div>
                   </div>
                 )
               })}
             </div>
           ) : (
             <div className="w-full overflow-x-auto">
               <table className="min-w-[800px] w-full border border-border rounded-xl overflow-hidden">
                 <thead className="bg-muted">
                   <tr>
                     <th className="text-left p-3 font-semibold text-foreground">Watch</th>
                     {comparisonData.map(attr => (
                       <th key={attr.key} className="text-left p-3 font-semibold text-foreground">{attr.label}</th>
                     ))}
                     <th className="p-3"></th>
                   </tr>
                 </thead>
                 <tbody>
                   {watches.map((product) => {
                     const data = product.data as Record<string, unknown>
                     const title = (data.brand && data.model)
                       ? `${String(data.brand)} ${String(data.model)}`
                       : product.name
                     return (
                       <tr key={product.id} className="border-t border-border">
                         <td className="p-3">
                           <div className="flex items-center gap-3">
                             <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted">
                               <Image
                                 src={product.image}
                                 alt={title}
                                 fill
                                 className="object-cover"
                               />
                             </div>
                             <div>
                               <div className="font-semibold text-foreground">{title}</div>
                               <div className="text-sm text-muted-foreground">{String(data.gender || '')}</div>
                             </div>
                           </div>
                         </td>
                         {comparisonData.map(attr => (
                           <td key={attr.key} className="p-3">
                             <div className="text-sm font-medium">
                               {formatValue(data[attr.key], attr.type, attr.suffix)}
                             </div>
                           </td>
                         ))}
                         <td className="p-3 text-right">
                           <button
                             onClick={() => removeProduct(product.id)}
                             className="inline-flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                           >
                             <X className="w-4 h-4" />
                             Remove
                           </button>
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
               className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm"
             >
               Clear All
             </button>
           </div>
         </div>
       </div>
       <Footer />
     </>
   )
 }
 
 export default ModernWatchComparePage
