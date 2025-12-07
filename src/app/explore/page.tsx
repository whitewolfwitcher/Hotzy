import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Explore Designs - Hotzy',
  description: 'Browse and customize your perfect Hotzy design',
};

export default function ExplorePage() {
  // Redirect to customizer page
  redirect('/customizer');
}