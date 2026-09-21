import { useState } from 'react';
import { useApplicationStatus, useApplyAsSeller } from '../../hooks/useSellerApplication';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

export default function BecomeSeller() {
  const { data: status, isLoading } = useApplicationStatus();
  const apply = useApplyAsSeller();

  const [form, setForm] = useState({ business_name: '', description: '' });
  const [document, setDocument] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('business_name', form.business_name);
    formData.append('description', form.description);
    if (document) formData.append('document', document);
    apply.mutate(formData);
  };

  if (isLoading) return <div className="mx-auto max-w-md px-6 py-8"><Skeleton className="h-64 w-full" /></div>;

  // Not yet applied, or was rejected → show the form (rejected users can reapply, Step 36's updateOrCreate)
  if (status.status === 'not_applied' || status.status === 'rejected') {
    return (
      <div className="mx-auto px-6 ">
        <h1 className="mb-2 text-xl font-semibold text-action">Become a Seller</h1>
        <p className="mb-4 text-sm text-slate-500">
          Tell us about your business. Our team reviews every application before granting seller access.
        </p>

        {status.status === 'rejected' && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
            Your previous application was rejected: "{status.rejected_reason}". You can reapply below.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Business name</Label>
            <Input
              className="text-darker"
              value={form.business_name}
              onChange={(e) => setForm({ ...form, business_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Describe your business</Label>
            <Textarea
              className="text-darker"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Supporting document (ID, business registration, etc.)</Label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="text-darker"
              onChange={(e) => setDocument(e.target.files[0])}
              required
            />
          </div>

          {apply.error && (
            <p className="text-sm font-semibold text-destructive">
              {apply.error.response?.data?.message ?? 'Something went wrong.'}
            </p>
          )}

          <Button type="submit" className="w-full bg-action hover:bg-darker" disabled={apply.isPending}>
            {apply.isPending ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </div>
    );
  }

  // Pending or approved → show status, no form
  return (
    <div className="mx-auto max-w-lg px-6 text-center">
      <h1 className="mb-2 text-xl font-semibold text-action">Application Status</h1>

      {status.status === 'pending' && (
        <>
            <p className="mt-2 text-xs text-slate-500">Submitted on {new Date(status.submitted_at).toLocaleDateString()}.</p>
            <img src="/app_pending.png" alt="Under review." className='max-h-95 mt-6' />
        </>
      )}

      {status.status === 'approved' && (
        <img src="/app_approved.png" alt="Approved." className='max-h-95 mt-6' />
      )}
    </div>
  );
}