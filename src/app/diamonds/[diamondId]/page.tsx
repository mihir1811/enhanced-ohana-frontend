import DiamondDetailsPage from '@/components/diamonds/DiamondDetailsPage';
import diamondService from '@/services/diamondService';
import { transformApiDiamond } from '@/components/diamonds/diamondUtils';
import NavigationUser from '@/components/Navigation/NavigationUser';
import Footer from '@/components/Footer';
import { ProductDetailSkeleton } from '@/components/ui/ProductDetailSkeleton';
import { Card } from '@/components/ui/card';
import { BuyerPageShell } from '@/components/buyer/BuyerPageShell';

export default async function DiamondDetailPage({
  params,
}: {
  params: { diamondId: string };
}) {
  const diamondId = params?.diamondId;

  let diamond = null;
  let error: string | null = null;

  try {
    if (!diamondId) {
      error = 'Failed to load diamond';
    } else {
      const apiRes = await diamondService.getDiamondById(diamondId);
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
      <BuyerPageShell className="py-6">
        {error ? (
          <Card className="text-center py-16 rounded-xl gap-0">
            <p className="mb-4 text-destructive">{error}</p>
          </Card>
        ) : (
          diamond ? <DiamondDetailsPage diamond={diamond} /> : <ProductDetailSkeleton />
        )}
      </BuyerPageShell>
      <Footer />
    </div>
  );
}
