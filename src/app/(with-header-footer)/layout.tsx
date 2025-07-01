import '../globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { createClient } from '@/lib/supabase/server';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      {children}
      <Footer />
    </>
  );
}
