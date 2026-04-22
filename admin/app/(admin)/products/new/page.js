import ProductForm from '../../../../components/ProductForm';
import Topbar from '../../../../components/Topbar';

export default function NewProductPage() {
  return (
    <div>
      <Topbar title="Add New Product" />
      <div className="p-6 max-w-4xl">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-6">Product Details</h2>
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
