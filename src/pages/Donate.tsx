import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const donationSchema = z.object({
  organizationName: z.string().trim().min(1, 'Organization name is required').max(200, 'Organization name must be less than 200 characters'),
  contactPerson: z.string().trim().min(1, 'Contact person is required').max(100, 'Contact person must be less than 100 characters'),
  phone: z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number (e.g., +911234567890)'),
  foodType: z.string().trim().min(1, 'Food type is required').max(200, 'Food type must be less than 200 characters'),
  quantity: z.string().trim().min(1, 'Quantity is required').max(100, 'Quantity must be less than 100 characters'),
  pickupAddress: z.string().trim().min(1, 'Pickup address is required').max(500, 'Pickup address must be less than 500 characters'),
  preferredTime: z.string().trim().max(100, 'Preferred time must be less than 100 characters').optional().or(z.literal('')),
  additionalNotes: z.string().trim().max(1000, 'Additional notes must be less than 1000 characters').optional().or(z.literal('')),
});

const Donate = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    phone: '',
    foodType: '',
    quantity: '',
    pickupAddress: '',
    preferredTime: '',
    additionalNotes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate form data
      const validatedData = donationSchema.parse(formData);

      // Save to database
      const { error } = await supabase
        .from('donations')
        .insert([
          {
            user_id: user.id,
            organization_name: validatedData.organizationName,
            contact_person: validatedData.contactPerson,
            phone: validatedData.phone,
            food_type: validatedData.foodType,
            quantity: validatedData.quantity,
            pickup_address: validatedData.pickupAddress,
            preferred_time: validatedData.preferredTime || null,
            additional_notes: validatedData.additionalNotes || null,
          },
        ]);

      if (error) throw error;

      // Send email notification using Web3Forms
      const web3formsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      
      if (web3formsKey && web3formsKey !== 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
        const emailData = {
          access_key: web3formsKey,
          subject: "New Donation Request - Community Fridge",
          from_name: "Community Fridge Platform",
          to: "communityfridge21@gmail.com",
          message: `
New Donation Request Submitted

Organization: ${validatedData.organizationName}
Contact Person: ${validatedData.contactPerson}
Phone: ${validatedData.phone}
Food Type: ${validatedData.foodType}
Quantity: ${validatedData.quantity}
Pickup Address: ${validatedData.pickupAddress}
Preferred Time: ${validatedData.preferredTime || 'Not specified'}
Additional Notes: ${validatedData.additionalNotes || 'None'}

User Email: ${user.email}
          `.trim()
        };

        // Send email (fire and forget)
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        }).catch(console.error);
      }

      toast.success('Thank you! Your donation request has been submitted successfully.');
      navigate('/profile');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please check the form for errors');
      } else {
        toast.error('Failed to submit donation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="mb-4 sm:mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">Become a Food Partner</h1>
        <p className="text-center text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12 px-4">
          Help us reduce food waste and feed those in need. Fill out the form below to partner with us.
        </p>

        <Card className="p-4 sm:p-6 md:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization/Restaurant Name *</Label>
              <Input
                id="organizationName"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                placeholder="Your business name"
                required
                disabled={loading}
                className={errors.organizationName ? 'border-red-500' : ''}
              />
              {errors.organizationName && (
                <p className="text-sm text-red-500">{errors.organizationName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Full name"
                required
                disabled={loading}
                className={errors.contactPerson ? 'border-red-500' : ''}
              />
              {errors.contactPerson && (
                <p className="text-sm text-red-500">{errors.contactPerson}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                required
                disabled={loading}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="foodType">Type of Food *</Label>
              <Input
                id="foodType"
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                placeholder="e.g., Cooked meals, fresh produce, packaged goods"
                required
                disabled={loading}
                className={errors.foodType ? 'border-red-500' : ''}
              />
              {errors.foodType && (
                <p className="text-sm text-red-500">{errors.foodType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Estimated Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 10 kg, 50 meals"
                required
                disabled={loading}
                className={errors.quantity ? 'border-red-500' : ''}
              />
              {errors.quantity && (
                <p className="text-sm text-red-500">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address *</Label>
              <Textarea
                id="pickupAddress"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                placeholder="Full address for pickup"
                required
                disabled={loading}
                rows={3}
                className={errors.pickupAddress ? 'border-red-500' : ''}
              />
              {errors.pickupAddress && (
                <p className="text-sm text-red-500">{errors.pickupAddress}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTime">Preferred Pickup Time</Label>
              <Input
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                placeholder="e.g., 2:00 PM - 4:00 PM"
                disabled={loading}
                className={errors.preferredTime ? 'border-red-500' : ''}
              />
              {errors.preferredTime && (
                <p className="text-sm text-red-500">{errors.preferredTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Any special instructions or information"
                disabled={loading}
                rows={4}
                className={errors.additionalNotes ? 'border-red-500' : ''}
              />
              {errors.additionalNotes && (
                <p className="text-sm text-red-500">{errors.additionalNotes}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Donation Request'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Donate;
