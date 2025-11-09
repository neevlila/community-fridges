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

const volunteerSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100, 'Full name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  availability: z.string().trim().max(200, 'Availability must be less than 200 characters').optional().or(z.literal('')),
  skills: z.string().trim().max(500, 'Skills must be less than 500 characters').optional().or(z.literal('')),
  experience: z.string().trim().max(1000, 'Experience must be less than 1000 characters').optional().or(z.literal('')),
  motivation: z.string().trim().min(1, 'Please tell us why you want to volunteer').max(1000, 'Motivation must be less than 1000 characters'),
});

const VolunteerLogin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    availability: '',
    skills: '',
    experience: '',
    motivation: '',
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
      const validatedData = volunteerSchema.parse(formData);

      // Check if user already has a volunteer profile
      const { data: existing } = await supabase
        .from('volunteers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        toast.error('You have already volunteered. You can only volunteer once per account.');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
        return;
      }

      // Insert volunteer data
      const { error } = await supabase
        .from('volunteers')
        .insert([
          {
            user_id: user.id,
            full_name: validatedData.fullName,
            email: validatedData.email,
            phone: validatedData.phone,
            availability: validatedData.availability || null,
            skills: validatedData.skills || null,
            experience: validatedData.experience || null,
            motivation: validatedData.motivation,
          },
        ]);

      if (error) throw error;

      // Send email notification using Web3Forms
      const web3formsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      
      if (web3formsKey && web3formsKey !== 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
        const emailData = {
          access_key: web3formsKey,
          subject: "New Volunteer Application - Community Fridge",
          from_name: "Community Fridge Platform",
          to: "communityfridge21@gmail.com",
          message: `
New Volunteer Application Submitted

Full Name: ${validatedData.fullName}
Email: ${validatedData.email}
Phone: ${validatedData.phone}
Availability: ${validatedData.availability || 'Not specified'}
Skills: ${validatedData.skills || 'Not specified'}
Experience: ${validatedData.experience || 'Not specified'}
Motivation: ${validatedData.motivation}

User ID: ${user.id}
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

      // Show success popup for 2 seconds before redirecting
      toast.success('You are Volunteered Successfully!', {
        duration: 2000,
      });
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error('Please check the form for errors');
      } else {
        toast.error('Failed to submit application. Please try again.');
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
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">Become a Volunteer</h1>
        <p className="text-center text-base sm:text-lg text-muted-foreground mb-8 sm:mb-12 px-4">
          Join our community and help make a difference. Fill out the application form below.
        </p>

        <Card className="p-4 sm:p-6 md:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                disabled={loading}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                disabled={loading}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
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
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                placeholder="e.g., Weekends, Weekdays evenings"
                disabled={loading}
                className={errors.availability ? 'border-red-500' : ''}
              />
              {errors.availability && (
                <p className="text-sm text-red-500">{errors.availability}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., Cooking, Driving, Event organization"
                disabled={loading}
                rows={3}
                className={errors.skills ? 'border-red-500' : ''}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Previous Volunteer Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Tell us about your previous volunteer experience"
                disabled={loading}
                rows={3}
                className={errors.experience ? 'border-red-500' : ''}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">{errors.experience}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">Why do you want to volunteer with us? *</Label>
              <Textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                placeholder="Share your motivation for volunteering"
                required
                disabled={loading}
                rows={4}
                className={errors.motivation ? 'border-red-500' : ''}
              />
              {errors.motivation && (
                <p className="text-sm text-red-500">{errors.motivation}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VolunteerLogin;
