"use client";

import { motion } from 'framer-motion';
import { Crown, Settings, CreditCard, Package } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NavigationHeader from '@/components/sections/navigation-header';
import Footer from '@/components/sections/footer';
import { PlanUsageIndicator } from '@/components/payments/plan-usage-indicator';
import Link from 'next/link';

export default function AccountPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login?redirect=/account');
    }
  }, [session, isPending, router]);
  
  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }
  
  if (!session) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-black">
      <NavigationHeader />
      
      <section className="relative py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(118,185,0,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(118,185,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(118,185,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="container relative z-10">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                My Account
              </h1>
              <p className="text-xl text-light-gray">
                Manage your subscription, usage, and account settings
              </p>
            </div>
            
            {/* Grid Layout */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Plan Usage */}
              <div className="md:col-span-1">
                <PlanUsageIndicator />
              </div>
              
              {/* Quick Actions */}
              <div className="md:col-span-1 space-y-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-primary" />
                  Quick Actions
                </h2>
                
                <Link
                  href="/pricing"
                  className="block p-6 bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Crown className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Upgrade Plan</h3>
                      <p className="text-sm text-muted-foreground">Get more features and unlimited access</p>
                    </div>
                  </div>
                </Link>
                
                <div className="block p-6 bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">My Orders</h3>
                      <p className="text-sm text-muted-foreground">View your order history and tracking</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Account Info */}
              <div className="md:col-span-2">
                <div className="p-8 bg-gradient-to-br from-[#1A1A1A] to-black border border-primary/20 rounded-2xl">
                  <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-primary/10">
                      <span className="text-muted-foreground">Name</span>
                      <span className="text-white font-medium">{session.user.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-primary/10">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-white font-medium">{session.user.email}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="text-white font-medium">
                        {new Date(session.user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
