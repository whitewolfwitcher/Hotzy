"use client";

import NavigationHeader from '@/components/sections/navigation-header';
import Footer from '@/components/sections/footer';
import { useState } from 'react';
import { toast } from 'sonner';
import { Sparkles, Star, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { GlareCard } from '@/components/ui/glare-card';

export default function GalleryPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call - replace with actual backend integration later
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('You\'re on the list! We\'ll notify you when Limited Editions launch.');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-black">
      <NavigationHeader />
      
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-primary/10 opacity-50" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        
        <div className="relative container py-32 md:py-48">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-8 opacity-0 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-eyebrow text-primary">Exclusive Launch</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-hero-h1 font-bold text-white mb-6 opacity-0 animate-slide-up">
              Limited Edition
              <span className="block text-primary">Coming Soon</span>
            </h1>

            {/* Subtitle */}
            <p className="text-body-large text-light-gray max-w-2xl mx-auto mb-12 opacity-0 animate-slide-up [animation-delay:100ms]">
              Be the first to access our exclusive limited edition Hotzy collection. 
              Designed by world-renowned artists, numbered and authenticated.
            </p>

            {/* Email Form or Success State */}
            {!isSubmitted ?
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-16 opacity-0 animate-slide-up [animation-delay:200ms]">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-dark-gray-1 border border-dark-gray-3 rounded-lg text-white placeholder:text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={isSubmitting} />

                  <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-primary hover:bg-accent-green-light text-black font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(118,185,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap">

                    {isSubmitting ? 'Joining...' : 'Join Whitelist'}
                  </button>
                </div>
                <p className="text-caption text-muted-foreground mt-3 text-left sm:text-center">
                  Join 1,247 others waiting for exclusive access
                </p>
              </form> :

            <div className="max-w-md mx-auto mb-16 animate-fade-in">
                <div className="flex items-center justify-center gap-3 px-6 py-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="text-white font-semibold">You're on the whitelist!</span>
                </div>
              </div>
            }

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto opacity-0 animate-slide-up [animation-delay:300ms]">
              <div className="p-6 bg-dark-gray-1/50 border border-dark-gray-3 rounded-lg backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group">
                <Star className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-h4 font-semibold text-white mb-2">Early Access</h3>
                <p className="text-body-small text-light-gray">
                  Get notified 24 hours before public launch
                </p>
              </div>

              <div className="p-6 bg-dark-gray-1/50 border border-dark-gray-3 rounded-lg backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group">
                <Zap className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-h4 font-semibold text-white mb-2">Exclusive Designs</h3>
                <p className="text-body-small text-light-gray">
                  Artist collaborations never to be repeated
                </p>
              </div>

              <div className="p-6 bg-dark-gray-1/50 border border-dark-gray-3 rounded-lg backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group">
                <Clock className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-h4 font-semibold text-white mb-2">Coming Q1 2026</h3>
                <p className="text-body-small text-light-gray">
                  Mark your calendars for something special
                </p>
              </div>
            </div>

            {/* Preview of Limited Edition Designs */}
            <div className="mt-20 pt-12 border-t border-dark-gray-3 opacity-0 animate-fade-in [animation-delay:400ms]">
              <p className="text-eyebrow text-primary mb-8 text-center">Limited Edition Preview</p>
              <h3 className="text-h2 font-bold text-white mb-4 text-center">Unrevealed Designs</h3>
              <p className="text-body-large text-light-gray text-center mb-12 max-w-2xl mx-auto">
                Get a glimpse of what's coming. Each design will be revealed exclusively to whitelist members first.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                <GlareCard className="flex flex-col items-center justify-center bg-gradient-to-br from-black via-dark-gray-1 to-primary/5">
                  <div className="relative w-full h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                      <div className="text-h3 font-bold text-primary mb-2">Design #1</div>
                      <div className="mt-6 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full inline-block">
                        <span className="text-caption text-primary font-bold">COMING SOON</span>
                      </div>
                    </div>
                  </div>
                </GlareCard>

                <GlareCard className="flex flex-col items-center justify-center bg-gradient-to-br from-black via-dark-gray-1 to-primary/5">
                  <img
                    className="h-full w-full absolute inset-0 object-cover opacity-40 blur-sm"
                    src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop"
                    alt="Unrevealed mug design"
                  />
                  <div className="relative z-10 text-center p-8">
                    <div className="text-h3 font-bold text-primary mb-2">Design #2</div>
                    <div className="mt-6 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full inline-block">
                      <span className="text-caption text-primary font-bold">COMING SOON</span>
                    </div>
                  </div>
                </GlareCard>

                <GlareCard className="flex flex-col items-center justify-center bg-gradient-to-br from-black via-dark-gray-1 to-primary/5">
                  <img
                    className="h-full w-full absolute inset-0 object-cover opacity-30 blur-md"
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop"
                    alt="Unrevealed mug design"
                  />
                  <div className="relative z-10 text-center p-8">
                    <div className="text-h3 font-bold text-primary mb-2">Design #3</div>
                    <div className="mt-6 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full inline-block">
                      <span className="text-caption text-primary font-bold">COMING SOON</span>
                    </div>
                  </div>
                </GlareCard>
              </div>

              <p className="text-body-small text-muted text-center mt-12">
                Each design is authenticated and numbered. Join the whitelist to be the first to see the full reveal.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>);

}