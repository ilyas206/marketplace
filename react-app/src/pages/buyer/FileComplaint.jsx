import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFileComplaint } from '../../hooks/useComplaints';
import { useOrders } from '../../hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function FileComplaint() {
  const navigate = useNavigate();
  const { data: orders } = useOrders();
  const fileComplaint = useFileComplaint();

  const [form, setForm] = useState({ order_id: '', seller_id: '', subject: '', description: '' });

  const selectedOrder = orders?.data.find((o) => o.id.toString() === form.order_id);
  const sellersInOrder = selectedOrder
  ? [
      ...new Map(
        (selectedOrder.items ?? [])
          .filter((i) => i?.seller?.id)
          .map((i) => [i.seller.id, i.seller])
      ).values()
    ]
  : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    fileComplaint.mutate(
      {
        order_id: form.order_id || null,
        seller_id: form.seller_id || null,
        subject: form.subject,
        description: form.description,
      },
      { onSuccess: () => navigate('/buyer/my-complaints') }
    );
  };

  return (
    <div className="mx-auto max-w-2xl md:px-6 py-2">
      <h1 className="mb-2 text-xl font-semibold text-action">File a Complaint</h1>
      <p className="mb-6 text-sm text-slate-500">
        Report an issue with an order, a seller, or your account in general.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label>Related order (optional)</Label>
          <Select
            value={form.order_id}
            onValueChange={(v) => setForm({ ...form, order_id: v, seller_id: '' })}
          >
            <SelectTrigger className="w-full text-darker"><SelectValue placeholder="No specific order" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">No specific order</SelectItem>
              {orders?.data.map((o) => (
                <SelectItem key={o.id} value={o.id.toString()} className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">Order #{o.id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {sellersInOrder.length > 0 && (
          <div className="space-y-1">
            <Label>Which seller? (optional)</Label>
            <Select value={form.seller_id} onValueChange={(v) => setForm({ ...form, seller_id: v })}>
              <SelectTrigger className="w-full text-darker"><SelectValue placeholder="General / not seller-specific" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">General / not seller-specific</SelectItem>
                {sellersInOrder.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()} className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-1">
          <Label>Subject</Label>
          <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="text-darker" required />
        </div>

        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="text-darker" required />
        </div>

        {fileComplaint.error && (
          <p className="text-sm text-destructive">
            {fileComplaint.error.response?.data?.message ?? 'Could not submit complaint.'}
          </p>
        )}

        <Button type="submit" className="w-full bg-action hover:bg-darker" disabled={fileComplaint.isPending}>
          {fileComplaint.isPending ? 'Submitting...' : 'Submit Complaint'}
        </Button>
      </form>
    </div>
  );
}