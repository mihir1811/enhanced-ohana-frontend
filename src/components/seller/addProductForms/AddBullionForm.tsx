import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  bullionService,
  MetalType,
  MetalShape,
  MetalFineness,
  CreateBullionRequest
} from '@/services/bullion.service';

const AddBullionForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [metalTypes, setMetalTypes] = useState<MetalType[]>([]);
  const [metalShapes, setMetalShapes] = useState<MetalShape[]>([]);
  const [allFineness, setAllFineness] = useState<MetalFineness[]>([]);
  const [metalFineness, setMetalFineness] = useState<MetalFineness[]>([]);

  const [formData, setFormData] = useState<Partial<CreateBullionRequest>>({
    stockNumber: '',
    metalWeight: '',
    price: '',
    quantity: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, shapes, fineness] = await Promise.all([
          bullionService.getMetalTypes(),
          bullionService.getMetalShapes(),
          bullionService.getMetalFineness()
        ]);
        setMetalTypes(types.data);
        setMetalShapes(shapes.data);
        setAllFineness(fineness.data);
        // setMetalFineness(fineness.data); // Don't set initially, wait for selection
      } catch (error) {
        console.error('Failed to fetch master data', error);
        toast.error('Failed to load form data');
      }
    };
    fetchData();
  }, []);

  // Filter fineness based on selected metal type
  useEffect(() => {
    if (formData.metalTypeId) {
      const filtered = allFineness.filter(f => f.metalTypeId === Number(formData.metalTypeId));
      setMetalFineness(filtered);
    } else {
      setMetalFineness([]);
    }
  }, [formData.metalTypeId, allFineness]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newData = { ...prev, [name]: value };
        // Reset dependent fields when parent changes
        if (name === 'metalTypeId') {
            newData.metalFinenessId = undefined; // Clear fineness
        }
        return newData;
    });
  };

  const handleFillRandom = () => {
    // Only select metal types that have associated fineness options
    const typesWithFineness = metalTypes.filter(type => 
        allFineness.some(f => f.metalTypeId === type.id)
    );
    
    const availableTypes = typesWithFineness.length > 0 ? typesWithFineness : metalTypes;
    const randomTypeObj = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const randomType = randomTypeObj ? randomTypeObj.id : '';

    const randomShape = metalShapes.length > 0 ? metalShapes[Math.floor(Math.random() * metalShapes.length)].id : '';
    
    // Filter fineness for the selected random type
    const validFineness = allFineness.filter(f => f.metalTypeId === Number(randomType));
    const randomFineness = validFineness.length > 0 ? validFineness[Math.floor(Math.random() * validFineness.length)].id : '';

    setFormData({
      stockNumber: Math.floor(1000 + Math.random() * 9000).toString(),
      metalTypeId: Number(randomType),
      metalShapeId: Number(randomShape),
      metalFinenessId: Number(randomFineness),
      metalWeight: (Math.random() * 100).toFixed(3),
      price: (Math.random() * 1000).toFixed(2),
      quantity: Math.floor(1 + Math.random() * 50),
      design: `Design ${Math.floor(Math.random() * 100)}`,
      demention: `${Math.floor(10 + Math.random() * 40)}mm x ${Math.floor(10 + Math.random() * 40)}mm`,
      condition: Math.random() > 0.5 ? 'New' : 'Mint',
      mintMark: `MM-${Math.floor(Math.random() * 100)}`,
      mintYear: Math.floor(1900 + Math.random() * 124),
      serialNumber: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      certificateNumber: `CERT-${Math.floor(10000 + Math.random() * 90000)}`,
      certification: Math.random() > 0.5 ? 'LBMA' : 'PAMP',
      availability: 'In Stock',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        // Validate and convert types
        const payload: CreateBullionRequest = {
            stockNumber: formData.stockNumber!,
            metalTypeId: Number(formData.metalTypeId),
            metalShapeId: Number(formData.metalShapeId),
            metalFinenessId: Number(formData.metalFinenessId),
            metalWeight: Number(formData.metalWeight).toFixed(3),
            price: Number(formData.price).toFixed(2),
            quantity: Math.floor(Number(formData.quantity)),
            design: formData.design,
            demention: formData.demention,
            condition: formData.condition,
            mintMark: formData.mintMark,
            mintYear: formData.mintYear ? Number(formData.mintYear) : undefined,
            serialNumber: formData.serialNumber,
            certificateNumber: formData.certificateNumber,
            certification: formData.certification,
            availability: formData.availability,
        };

        await bullionService.createBullion(payload);
        toast.success('Bullion product created successfully');
        router.push('/seller/products');
    } catch (error: any) {
        toast.error(error.message || 'Failed to create product');
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add New Bullion Product</h2>
            <button
                type="button"
                onClick={handleFillRandom}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
            >
                Fill Random Data
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stock Number */}
            <div>
                <label className="block text-sm font-medium mb-1">Stock Number *</label>
                <input
                    type="text"
                    name="stockNumber"
                    required
                    value={formData.stockNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Metal Type */}
            <div>
                <label className="block text-sm font-medium mb-1">Metal Type *</label>
                <select
                    name="metalTypeId"
                    required
                    value={formData.metalTypeId || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="">Select Metal Type</option>
                    {metalTypes.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>

            {/* Metal Shape */}
            <div>
                <label className="block text-sm font-medium mb-1">Metal Shape *</label>
                <select
                    name="metalShapeId"
                    required
                    value={formData.metalShapeId || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="">Select Shape</option>
                    {metalShapes.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>

            {/* Metal Fineness */}
            <div>
                <label className="block text-sm font-medium mb-1">Purity (Fineness) *</label>
                <select
                    name="metalFinenessId"
                    required
                    value={formData.metalFinenessId || ''}
                    onChange={handleChange}
                    disabled={metalFineness.length === 0}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-100 disabled:text-gray-400"
                >
                    <option value="">{metalFineness.length === 0 ? 'Select Metal Type first' : 'Select Purity'}</option>
                    {metalFineness.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                </select>
            </div>

            {/* Weight */}
            <div>
                <label className="block text-sm font-medium mb-1">Weight (g) *</label>
                <input
                    type="number"
                    step="0.001"
                    name="metalWeight"
                    required
                    value={formData.metalWeight}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

             {/* Quantity */}
             <div>
                <label className="block text-sm font-medium mb-1">Quantity *</label>
                <input
                    type="number"
                    name="quantity"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Dimension */}
            <div>
                <label className="block text-sm font-medium mb-1">Dimension</label>
                <input
                    type="text"
                    name="demention"
                    value={formData.demention || ''}
                    onChange={handleChange}
                    placeholder="e.g. 25mm x 15mm"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Design */}
            <div>
                <label className="block text-sm font-medium mb-1">Design</label>
                <input
                    type="text"
                    name="design"
                    value={formData.design || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

             {/* Condition */}
             <div>
                <label className="block text-sm font-medium mb-1">Condition</label>
                <input
                    type="text"
                    name="condition"
                    value={formData.condition || ''}
                    onChange={handleChange}
                    placeholder="e.g. New, Mint"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

             {/* Mint Mark */}
             <div>
                <label className="block text-sm font-medium mb-1">Mint Mark</label>
                <input
                    type="text"
                    name="mintMark"
                    value={formData.mintMark || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Mint Year */}
            <div>
                <label className="block text-sm font-medium mb-1">Mint Year</label>
                <input
                    type="number"
                    name="mintYear"
                    value={formData.mintYear || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Serial Number */}
            <div>
                <label className="block text-sm font-medium mb-1">Serial Number</label>
                <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Certificate Number */}
            <div>
                <label className="block text-sm font-medium mb-1">Certificate Number</label>
                <input
                    type="text"
                    name="certificateNumber"
                    value={formData.certificateNumber || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Certification */}
            <div>
                <label className="block text-sm font-medium mb-1">Certification</label>
                <input
                    type="text"
                    name="certification"
                    value={formData.certification || ''}
                    onChange={handleChange}
                    placeholder="e.g. LBMA"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Availability */}
            <div>
                <label className="block text-sm font-medium mb-1">Availability</label>
                <input
                    type="text"
                    name="availability"
                    value={formData.availability || ''}
                    onChange={handleChange}
                    placeholder="e.g. In Stock"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
            <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
                {loading ? 'Creating...' : 'Create Product'}
            </button>
        </div>
    </form>
  );
};

export default AddBullionForm;
