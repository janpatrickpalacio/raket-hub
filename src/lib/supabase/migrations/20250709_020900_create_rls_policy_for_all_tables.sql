-- This script sets up all the necessary Row Level Security (RLS) policies
-- for the entire RaketHub application. Run this in your Supabase SQL Editor.

-- =================================================================
--  Step 1: Enable RLS on all tables
-- =================================================================
-- This is a one-time command per table. Once enabled, no data can be
-- accessed until a policy is created to allow it.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;


-- =================================================================
--  Step 2: Policies for Publicly Readable Data
-- =================================================================
-- These policies allow anyone (even logged-out users) to view
-- essential public information.

-- Allow anyone to see all categories and subcategories.
CREATE POLICY "Categories are publicly viewable." ON public.categories FOR SELECT USING (true);
CREATE POLICY "Subcategories are publicly viewable." ON public.subcategories FOR SELECT USING (true);

-- Allow anyone to see active services.
CREATE POLICY "Active services are publicly viewable." ON public.services FOR SELECT USING (is_active = true);

-- Allow anyone to see user profiles.
-- CREATE POLICY "User profiles are publicly viewable." ON public.users FOR SELECT USING (true);

-- Allow anyone to see reviews.
CREATE POLICY "Reviews are publicly viewable." ON public.reviews FOR SELECT USING (true);


-- =================================================================
--  Step 3: Policies for Authenticated User Actions
-- =================================================================
-- These policies control what logged-in users can do with their own data.

-- USERS Table
-- CREATE POLICY "Users can update their own profile." ON public.users FOR UPDATE USING (auth.uid() = id);

-- SERVICES Table
CREATE POLICY "Users can create services." ON public.services FOR INSERT WITH CHECK (auth.uid() = raketero_id);
CREATE POLICY "Users can update their own services." ON public.services FOR UPDATE USING (auth.uid() = raketero_id);
CREATE POLICY "Users can delete their own services." ON public.services FOR DELETE USING (auth.uid() = raketero_id);

-- ORDERS Table
CREATE POLICY "Users can create orders." ON public.orders FOR INSERT WITH CHECK (auth.uid() = kliyente_id);
CREATE POLICY "Users can view orders they are involved in." ON public.orders FOR SELECT USING (auth.uid() = kliyente_id OR auth.uid() = raketero_id);
CREATE POLICY "Users can update the status of their own orders." ON public.orders FOR UPDATE USING (auth.uid() = kliyente_id OR auth.uid() = raketero_id);

-- REVIEWS Table
CREATE POLICY "Users can create reviews for orders they were part of." ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = reviews.order_id AND (kliyente_id = auth.uid() OR raketero_id = auth.uid())
  )
);
CREATE POLICY "Users can delete their own reviews." ON public.reviews FOR DELETE USING (auth.uid() = reviewer_id);


-- =================================================================
--  Step 4: Policies for the Chat System
-- =================================================================
-- These policies ensure that conversations and messages are private.

-- Allow users to create new conversations.
CREATE POLICY "Users can create conversations." ON public.conversations FOR INSERT WITH CHECK (true);

-- Allow users to add themselves to conversations.
CREATE POLICY "Users can manage their own participation in conversations." ON public.conversation_participants FOR ALL USING (auth.uid() = user_id);

-- Allow users to see conversations they are a part of.
CREATE POLICY "Users can view conversations they are in." ON public.conversations FOR SELECT USING (
  id IN (
    SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()
  )
);

-- Allow users to send and receive messages in their conversations.
CREATE POLICY "Users can send messages in their conversations." ON public.messages FOR INSERT WITH CHECK (
  sender_id = auth.uid() AND
  conversation_id IN (
    SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can view messages in their conversations." ON public.messages FOR SELECT USING (
  conversation_id IN (
    SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()
  )
);