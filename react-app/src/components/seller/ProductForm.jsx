import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Flattens the nested category tree (from Step 65's admin index — parent + children)
// into a flat list for the dropdown, since a seller picks a single leaf category
function flattenCategories(categories) {
  const flat = [];
  categories?.forEach((cat) => {
    flat.push(cat);
    cat.children?.forEach((child) => flat.push(child));
  });
  return flat;
}

export default function ProductForm({ initialData, onSubmit, isPending, errors, mode }) {
  const { data: categories } = useCategories();
  const flatCategories = flattenCategories(categories);

  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    category_id: initialData?.category?.id?.toString() ?? '',
    price: initialData?.price ?? '',
    discount_price: initialData?.discount_price ?? '',
    stock: initialData?.stock ?? '',
  });
  const [images, setImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'create') {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== '') formData.append(key, value);
      });
      images.forEach((file) => formData.append('images[]', file));
      onSubmit(formData);
    } else {
      // Update only sends changed JSON fields — no images on edit (kept simple; a
      // dedicated "manage images" action would be a separate follow-up feature)
      onSubmit(form);
    }
  };

  const field = (key, label, type = 'text', extraProps = {}) => (
    <div className="space-y-1">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        {...extraProps}
      />
      {errors?.[key] && <p className="text-sm font-semibold text-destructive">{errors[key][0]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {field('title', 'Title')}

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
        />
        {errors?.description && (
          <p className="text-sm font-semibold text-destructive">{errors.description[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Category</Label>
        <Select
          value={form.category_id}
          onValueChange={(v) => setForm({ ...form, category_id: v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {flatCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()} className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">
                {cat.parent_id ? `— ${cat.name}` : cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.category_id && (
          <p className="text-sm font-semibold text-destructive">{errors.category_id[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field('price', 'Price (MAD)', 'number', { step: '0.01', min: 0 })}
        {field('discount_price', 'Discount price (optional)', 'number', { step: '0.01', min: 0 })}
      </div>

      {field('stock', 'Stock quantity', 'number', { min: 0 })}

      {mode === 'create' && (
        <div className="space-y-1">
          <Label htmlFor="images">Product images (up to 6)</Label>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setImages(Array.from(e.target.files))}
          />
          {errors?.images && <p className="text-sm font-semibold text-destructive">{errors.images[0]}</p>}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full bg-action hover:bg-darker mt-3">
        {isPending ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
      </Button>
    </form>
  );
}