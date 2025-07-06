import HeroSection from '@/components/hero-section';
import SectionWrapper from '@/components/section-wrapper';
import StepCard from '@/features/home/components/step-card';
import FaqItem from '@/features/how-it-works/components/faq-item';
import { DollarSign, Edit, Link, Lock, Search, ThumbsUp } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How RaketHub Works | RaketHub',
  description: 'Find trusted Filipino talent for any project, big or small.',
};

export default function HowItWorksPage() {
  return (
    <main>
      <HeroSection
        title='Your Guide to RaketHub'
        description="Whether you're looking to hire talent or offer your skills, we've made the process simple, safe, and secure."
      />
      <div className='[&>section]:odd:bg-white [&>section]:even:bg-neutral-50'>
        <SectionWrapper title='For Kliyentes (Clients)' description='Find the right Raketero for your project.'>
          <div className='grid gap-8 sm:grid-cols-3'>
            <StepCard
              title='1. Search & Discover'
              description='Use our powerful search to find services. Compare prices, portfolios, and reviews to find the perfect Raketero for your project.'
              stepIcon={<Search size={40} />}
            />
            <StepCard
              title='2. Hire & Pay Securely'
              description="Chat with your pro, agree on the scope, and pay through our secure system using GCash, Maya, or card. We hold the payment in escrow until you're satisfied."
              stepIcon={<Lock size={40} />}
            />
            <StepCard
              title='3. Approve & Rate'
              description='Once the work is delivered, you can approve the project to release the payment. Leave a review to help the Raketero and our community grow!'
              stepIcon={<ThumbsUp size={40} />}
            />
          </div>
        </SectionWrapper>
        <SectionWrapper title='For Raketeros (Freelancers)' description='Grow your business with RaketHub.'>
          <div className='grid gap-8 sm:grid-cols-3'>
            <StepCard
              variant='yellow'
              title='1. Create Your Gig'
              description='Sign up for free, build your profile, and create your first "Gig." Describe your service, add a portfolio, and set your price.'
              stepIcon={<Edit size={40} />}
            />
            <StepCard
              variant='yellow'
              title='2. Connect & Deliver'
              description='Get notified when you receive an order. Use our platform to manage communication, share files, and deliver excellent work.'
              stepIcon={<Link size={40} />}
            />
            <StepCard
              variant='yellow'
              title='3. Get Paid'
              description='Once the client approves, your payment (minus our 15% service fee) is sent to your RaketHub wallet. Withdraw your earnings easily to your bank or e-wallet.'
              stepIcon={<DollarSign size={40} />}
            />
          </div>
        </SectionWrapper>
        <SectionWrapper title='Frequently Asked Questions'>
          <div className='mt-8 flex flex-col gap-8 sm:mt-12'>
            <FaqItem
              question='How much does it cost to use RaketHub?'
              answer="It's free to sign up and browse for services! For clients, you only pay the price listed on the Gig. For Raketeros, we deduct a transparent 15% service fee from the total order value once the job is successfully completed and paid."
            />
            <FaqItem
              question='What is the escrow system? How does it protect me?'
              answer='Our escrow system provides security for both parties. When a client pays for a Gig, RaketHub holds the funds securely. We only release the payment to the Raketero after the client has received the work and marked the job as complete. This prevents scams and ensures everyone gets what they paid for.'
            />
            <FaqItem
              question='What if I have a problem with an order?'
              answer="We encourage clients and Raketeros to communicate directly to resolve any issues. However, if you can't reach an agreement, our Resolution Center is available to help mediate disputes fairly."
            />
            <FaqItem
              question='What kind of services can I offer?'
              answer='Almost any skill you can think of! From digital services like graphic design, writing, and social media management, to local services like home cleaning, errand running, event planning, and tutoring. If you have a skill, chances are someone on RaketHub needs it.'
            />
          </div>
        </SectionWrapper>
      </div>
    </main>
  );
}
