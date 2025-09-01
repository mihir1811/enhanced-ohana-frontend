import NavigationUser from '@/components/Navigation/NavigationUser';
import BecomeSellerForm from '../../components/become-seller/BecomeSellerForm';
import Footer from '@/components/Footer';

export default function Page() {
	return (
		<>
			<NavigationUser />
			<div className="min-h-screen bg-gray-50 py-10">
				<BecomeSellerForm />
			</div>
			<Footer />
		</>
	);
}
