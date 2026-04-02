import DiamondDetailsPage from '@/components/diamonds/DiamondDetailsPage';
import diamondService from '@/services/diamondService';
import { transformApiDiamond } from '@/components/diamonds/diamondUtils';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { SECTION_WIDTH } from '@/lib/constants';
import { ProductDetailSkeleton } from '@/components/ui/ProductDetailSkeleton';
import { Card } from '@/components/ui/card';
import { cookies } from 'next/headers';

export default async function DiamondDetailPage({
  params,
}: {
  params: Promise<{ diamondId: string }>;
}) {
  const { diamondId } = await params;

  let diamond = null;
  let error: string | null = null;

  try {
    if (!diamondId) {
      error = 'Failed to load diamond';
    } else {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      const apiRes = await diamondService.getDiamondById(diamondId, token);
      if (apiRes?.data) {
        diamond = transformApiDiamond(apiRes.data);
      } else {
        diamond = null;
      }
    }
  } catch {
    error = 'Failed to load diamond';
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <NavigationUser />
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: SECTION_WIDTH }}>
        {error ? (
          <Card className="text-center py-16 rounded-xl gap-0">
            <p className="mb-4 text-destructive">{error}</p>
          </Card>
        ) : (
          diamond ? <DiamondDetailsPage diamond={diamond} /> : <ProductDetailSkeleton />
        )}
      </div>
      <Footer />
    </div>
  );
}
